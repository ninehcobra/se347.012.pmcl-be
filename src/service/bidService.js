import db from "../models/index"
import { sendBidNotificationEmail, sendWinNotificationEmail } from "./emailService";
import { Op } from "sequelize";

const placeBid = async (userId, productId, bidAmount) => {
    try {

        // Kiểm tra xem người dùng và sản phẩm có tồn tại hay không
        const user = await db.User.findByPk(userId);
        const product = await db.Product.findByPk(productId, {
            include: {
                model: db.Auction,
            },
        });

        if (!user || !product) {
            return {
                EC: -1,
                EM: 'User or product not found',
            };
        }

        // Kiểm tra xem thời gian đặt giá có hợp lệ không
        const currentTime = new Date();
        if (currentTime < product.startTime || currentTime > product.endTime) {
            return {
                EC: -2,
                EM: 'Bidding is not allowed at the moment',
            };
        }

        // Kiểm tra xem giá đặt có cao hơn giá hiện tại không
        const currentPrice = parseFloat(product.currentPrice);
        const bidAmountFloat = parseFloat(bidAmount);

        if (bidAmountFloat <= currentPrice) {
            return {
                EC: -3,
                EM: 'Bid amount must be higher than the current price',
            };
        }

        // Nếu sản phẩm chưa có phiên đấu giá, tạo mới phiên đấu giá
        let auction;

        if (product.dataValues.Auctions.length < 1) {
            auction = await db.Auction.create({
                productId: productId,
                bidCount: 0,
            });

        } else {
            auction = product.Auctions[0];
        }

        // Thực hiện đặt giá
        await db.sequelize.transaction(async (t) => {
            // Cập nhật giá hiện tại của sản phẩm
            await product.update({
                currentPrice: bidAmountFloat.toFixed(2),
            }, { transaction: t });

            // Tạo mới bản ghi Bid
            await db.Bid.create({
                auctionId: auction.id,
                userId: userId,
                bidAmount: bidAmountFloat.toFixed(2),
                bidTime: currentTime,
            }, { transaction: t });

            // Cập nhật winnerId trong bảng Auction
            await auction.update({
                winnerId: userId,
                bidCount: db.sequelize.literal('bidCount + 1'),
            }, { transaction: t });
        });

        const bidders = await db.Bid.findAll({
            where: { auctionId: auction.id },
            attributes: ['userId'],
            group: ['userId'], // Nhóm kết quả theo userId để tránh trùng lặp
            raw: true, // Trả về dữ liệu dạng JSON thô, không phải instance của Model
        });

        const bidderUserIds = bidders.map((bidder) => bidder.userId);
        const bidderDetails = await db.User.findAll({
            where: { id: bidderUserIds },
            attributes: ['id', 'name', 'email'],
            raw: true // Thay đổi theo nhu cầu của bạn
        });

        bidderDetails.forEach((bidder) => {
            if (bidder.id === userId) { }
            else {
                sendBidNotificationEmail(bidder.email, product)
            }

        })
        return {
            EC: 0,
            EM: 'Bid placed successfully',
        };
    } catch (error) {
        console.error(error);
        return {
            EC: -4,
            EM: 'Something went wrong on the server',
        };
    }
};

const getBidHistory = async (productId) => {
    try {
        const bidHistory = await db.Bid.findAll({
            where: {
                auctionId: productId,
            },
            include: {
                model: db.User,
                attributes: ['name', 'email', 'phoneNumber', 'address']
            },
            order: [['bidTime', 'DESC']],
        });

        return {
            EC: 0,
            EM: 'Get bid history success',
            DT: bidHistory,
        };
    } catch (error) {
        console.error(error);
        return {
            EC: -1,
            EM: 'Something went wrong on the server',
        };
    }
};

const getUserBids = async (userId) => {
    try {
        const userBids = await db.Bid.findAll({
            where: {
                userId: userId,
            },
            include: {
                model: db.Product,
                include: {
                    model: db.Auction,
                },
            },
            order: [['bidTime', 'DESC']],
        });

        return {
            EC: 0,
            EM: 'Get user bids success',
            DT: userBids,
        };
    } catch (error) {
        console.error(error);
        return {
            EC: -1,
            EM: 'Something went wrong on the server',
        };
    }
};

const getUserAuctionStats = async (userId) => {
    try {
        // Đếm số lượng cuộc đấu giá tổng cộng của người dùng
        const ongoingAuctionsCount = await db.Bid.count({
            distinct: true,
            col: 'AuctionId', // Đếm theo số lượng phiên đấu giá khác nhau
            where: {
                userId: userId,
            },
            include: [
                {
                    model: db.Auction,
                    include: [
                        {
                            model: db.Product,
                            where: {
                                isCompleted: false,
                                endTime: {
                                    [Op.gt]: new Date(), // Lấy ra các sản phẩm có endTime trong tương lai
                                },
                            },
                        },
                    ],
                },
            ],
        });



        return {
            EC: 0,
            EM: 'Success',
            DT: ongoingAuctionsCount,
        };
    } catch (error) {
        console.error('Error fetching user auction stats:', error);
        return {
            EC: -1,
            EM: 'Something went wrong on the server',
        };
    }
};

const getUserBiddingHistory = async (userId, options) => {
    if (userId && options.limit && options.page) {
        try {
            let page = parseInt(options.page);
            let limit = parseInt(options.limit);
            let offset = (page - 1) * limit;

            let { count, rows } = await db.Bid.findAndCountAll({
                where: {
                    userId: userId,
                },
                include: [
                    {
                        model: db.Auction,
                        include: [
                            {
                                model: db.Product,
                                where: {
                                    isCompleted: false,
                                    endTime: {
                                        [Op.gt]: new Date(), // Lấy ra các sản phẩm có endTime trong tương lai
                                    },
                                },
                            },
                        ],
                    },
                ],
                order: [['bidTime', 'DESC']],
                offset: offset,
                limit: limit,
            });

            // Lọc chỉ giữ lại các sản phẩm có endTime trong tương lai
            rows = rows.filter((bid) => bid.Auction.Product.endTime > new Date());

            return {
                EC: 0,
                EM: 'Get user bidding history success',
                DT: {
                    totalRows: count,
                    totalPages: Math.ceil(count / limit),
                    bids: rows,
                },
            };
        } catch (error) {
            return {
                EC: -1,
                EM: 'Something wrong on server',
            };
        }
    } else {
        return {
            EC: -3,
            EM: 'Missing parameters',
        };
    }
};


const getFinishedBidHistory = async (userId, options) => {
    if (userId && options.limit && options.page) {
        try {
            let page = parseInt(options.page);
            let limit = parseInt(options.limit);
            let offset = (page - 1) * limit;

            let { count, rows } = await db.Bid.findAndCountAll({
                where: {
                    userId: userId,
                },
                include: [
                    {
                        model: db.Auction,
                        include: [
                            {
                                model: db.Product,
                                where: {
                                    isCompleted: true,
                                    endTime: {
                                        [Op.lt]: new Date(), // Lấy ra các sản phẩm có endTime đã kết thúc
                                    },
                                },
                            },
                        ],
                    },
                ],
                order: [['bidTime', 'DESC']],
                offset: offset,
                limit: limit,
            });

            return {
                EC: 0,
                EM: 'Get user finished bidding success',
                DT: {
                    totalRows: count,
                    totalPages: Math.ceil(count / limit),
                    bids: rows,
                },
            };
        } catch (error) {
            return {
                EC: -1,
                EM: 'Something wrong on server',
            };
        }
    } else {
        return {
            EC: -3,
            EM: 'Missing parameters',
        };
    }
};

const setFinishProduct = async (productId, winnerId) => {
    try {
        const product = await db.Product.findByPk(productId);

        if (!product) {
            return {
                EC: -1,
                EM: 'Product not found',
            };
        }

        // Kiểm tra nếu sản phẩm đã hoàn thành thì không cần cập nhật lại
        if (product.isCompleted) {
            return {
                EC: 0,
                EM: 'Product is already completed',
            };
        }

        // Cập nhật trạng thái kết thúc của sản phẩm
        await product.update({
            isCompleted: true,
        });

        let user = await db.User.findOne({
            where: {
                id: winnerId
            },
            raw: true
        })

        console.log(user)

        await sendWinNotificationEmail(user.email, product)

        return {
            EC: 0,
            EM: 'Set product finish success',
        };
    } catch (error) {
        return {
            EC: -1,
            EM: 'Something wrong on server',
        };
    }
};

module.exports = {
    placeBid,
    getBidHistory,
    getUserAuctionStats,
    getUserBiddingHistory,
    setFinishProduct,
    getFinishedBidHistory
};

