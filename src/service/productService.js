import db from "../models/index"
const { Op, col, literal } = require('sequelize');

const createProduct = async (data) => {
    if (data && data.name && data.user) {
        try {

            let res = await db.Product.create({
                name: data.name,
                sellerId: data.user.id,
                isPublished: false,
                isCompleted: false,
                isPay: false
            })

            return ({
                EC: 0,
                EM: 'Create prodct success',
                DT: {
                    id: res.id
                }
            })
        } catch (error) {
            return ({
                EC: -1,
                EM: 'Something wrong on server'
            })
        }
    }
    else {
        return (
            {
                EC: -2,
                EM: 'Missing parameters'
            }
        )
    }
}

const getProduct = async (productId) => {
    if (productId) {
        try {
            const productDetails = await db.Product.findOne({
                where: {
                    id: parseInt(productId),
                },
                include: [
                    {
                        model: db.User,
                        attributes: ['name', 'id', 'avatar'],
                    },
                    {
                        model: db.Auction,
                        include: [
                            {
                                model: db.Bid,
                                include: {
                                    model: db.User,
                                    attributes: ['name', 'id', 'avatar'],
                                },
                                order: [['bidAmount', 'DESC']], // Sắp xếp theo giá đấu giảm dần để lấy bid cao nhất
                                limit: 1, // Lấy chỉ 1 bid cao nhất
                            },
                        ],
                    },
                    {
                        model: db.Favorite
                    }
                ],
            });

            return {
                EC: 0,
                EM: 'Get product details success',
                DT: productDetails,
            };
        } catch (error) {
            console.error(error);
            return {
                EC: -1,
                EM: 'Something went wrong on the server',
            };
        }
    } else {
        return {
            EC: -2,
            EM: 'Missing parameters',
        };
    }
}



const updateProduct = async (data) => {
    let product = data.data
    if (data && product.id) {
        try {
            if (product.type === 1) {
                await db.Product.update({
                    name: product.name,
                    descriptionMarkdown: product.descriptionMarkdown,
                    descriptionHTML: product.descriptionHTML,
                    startPrice: product.startPrice,
                    currentPrice: product.startPrice,
                    jumpPrice: product.jumpPrice,
                    startTime: product.startTime,
                    endTime: product.endTime,
                    categoryId: product.categoryId,
                    images: product.images && product.images.length > 0 ? product.images : null,
                    updatedAt: new Date(),
                    isPublished: product.isPublished
                }, {
                    where: {
                        id: product.id
                    }
                })
            }
            else {
                await db.Product.update({
                    name: product.name,
                    descriptionMarkdown: product.descriptionMarkdown,
                    descriptionHTML: product.descriptionHTML,
                    startPrice: product.startPrice,
                    currentPrice: product.startPrice,
                    jumpPrice: product.jumpPrice,
                    startTime: product.startTime,
                    endTime: product.endTime,
                    categoryId: product.categoryId,
                    updatedAt: new Date(),
                    isPublished: product.isPublished
                }, {
                    where: {
                        id: product.id
                    }
                })
            }

            return {
                EC: 0,
                EM: 'Update product success'
            }
        } catch (error) {
            return {
                EC: -1,
                EM: 'Something wrong on server'
            }
        }
    }
    else {
        return {
            EC: -2,
            EM: 'Missing parameter'
        }
    }
}

const deleteProduct = async (id) => {
    if (id) {
        try {
            await db.Product.destroy({
                where: {
                    id: id
                }
            })
            return {
                EC: 0,
                EM: 'Delete success'
            }
        } catch (error) {
            return {
                EC: -1,
                EM: 'Something wrongs on server'
            }
        }
    }
    else {
        return {
            EC: -2,
            EM: 'Missing parameters'
        }
    }
}

const getOwnerProduct = async (userId, options) => {
    if (userId && options && options.limit && options.page) {
        try {

            let page = parseInt(options.page)
            let limit = parseInt(options.limit)
            let offset = (page - 1) * limit


            let whereClause = {
                sellerId: userId,
            };


            if (options && options.productName !== undefined) {

                whereClause.name = literal(`LOWER(name) LIKE LOWER('%${options.productName}%') COLLATE utf8mb4_unicode_ci`);
            }


            // Thêm điều kiện lọc theo category
            if (options && options.categoryId !== undefined && options.categoryId) {
                whereClause.categoryId = options.categoryId;
            }

            let orderBy = [['currentPrice', 'ASC']]; // Mặc định sắp xếp theo giá tăng dần

            if (options && options.sortByPrice !== undefined) {
                // Nếu có điều kiện sắp xếp theo giá, cập nhật orderBy
                orderBy = options.sortByPrice === 'asc' ? [['currentPrice', 'ASC']] : [['currentPrice', 'DESC']];
            }


            let { count, rows } = await db.Product.findAndCountAll({
                where: whereClause,
                order: orderBy,
                offset: offset,
                limit: limit,
            });

            return {
                EC: 0,
                EM: 'Get product success',
                DT: {
                    totalRows: count,
                    totalPages: Math.ceil(count / limit),
                    products: rows
                },
            };
        } catch (error) {
            return {
                EC: -1,
                EM: 'Something wrongs on server',
            };
        }
    } else {
        return {
            EC: -2,
            EM: 'Missing parameters',
        };
    }
};

const getDashboardProduct = async (userId, options) => {
    console.log(userId, options)
    if (userId && options && options.limit && options.page) {
        try {

            let page = parseInt(options.page)
            let limit = parseInt(options.limit)
            let offset = (page - 1) * limit


            let whereClause = {
                isPublished: true,
                endTime: {
                    [Op.gt]: new Date(), // Chỉ lấy những sản phẩm có thời gian kết thúc lớn hơn thời điểm hiện tại
                },
            };


            if (options && options.productName !== undefined) {

                whereClause.name = literal(`LOWER(name) LIKE LOWER('%${options.productName}%') COLLATE utf8mb4_unicode_ci`);
            }


            // Thêm điều kiện lọc theo category
            if (options && options.categoryId !== undefined && options.categoryId) {
                whereClause.categoryId = options.categoryId;
            }

            let orderBy = [['currentPrice', 'ASC']]; // Mặc định sắp xếp theo giá tăng dần

            if (options && options.sortByPrice !== undefined) {
                // Nếu có điều kiện sắp xếp theo giá, cập nhật orderBy
                orderBy = options.sortByPrice === 'asc' ? [['currentPrice', 'ASC']] : [['currentPrice', 'DESC']];
            }


            let { count, rows } = await db.Product.findAndCountAll({
                where: whereClause,
                order: orderBy,
                offset: offset,
                limit: limit,
            });

            return {
                EC: 0,
                EM: 'Get product success',
                DT: {
                    totalRows: count,
                    totalPages: Math.ceil(count / limit),
                    products: rows
                },
            };
        } catch (error) {
            return {
                EC: -1,
                EM: 'Something wrongs on server',
            };
        }
    } else {
        return {
            EC: -2,
            EM: 'Missing parameters',
        };
    }
};

const findAllExpiredProducts = async () => {
    try {
        const currentTime = new Date();

        const expiredProducts = await db.Product.findAll({
            where: {
                isCompleted: false,
                endTime: {
                    [Op.lt]: currentTime,
                },
            },

            include: {
                model: db.Auction
            },
            raw: true,
        });

        return {
            EC: 0,
            EM: 'Find expired products success',
            DT: expiredProducts,
        };
    } catch (error) {
        console.error('Error finding expired products:', error);

        return {
            EC: -1,
            EM: 'Something went wrong on the server',
        };
    }
};

const getWonProducts = async (userId) => {
    try {
        const wonProducts = await db.Product.findAll({
            where: {
                isCompleted: true
            },
            include: {
                model: db.Auction,
                where: {
                    winnerId: userId,
                },
            },
        });

        return {
            EC: 0,
            EM: 'Get won products success',
            DT: wonProducts,
        };
    } catch (error) {
        return {
            EC: -1,
            EM: 'Something wrong on server',
        };
    }
};

const payProduct = async (id) => {
    try {
        await db.Product.update({
            isPay: true
        }, {
            where: {
                id: id
            }
        })

        return {
            EC: 0,
            EM: 'Pay success',
            DT: wonProducts,
        };
    } catch (error) {
        return {
            EC: -1,
            EM: 'Something wrong on server',
        };
    }
};


module.exports = {
    createProduct,
    getProduct,
    updateProduct,
    getOwnerProduct,
    getDashboardProduct,
    findAllExpiredProducts,
    getWonProducts,
    payProduct
}