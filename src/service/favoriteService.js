import db from "../models/index"
const { Op, col, literal } = require('sequelize');

const addToFavorites = async (userId, productId) => {
    try {
        const favorite = await db.Favorite.create({
            userId: userId,
            productId: productId,
        });

        return {
            EC: 0,
            EM: 'Added to favorites successfully',
            DT: favorite,
        };
    } catch (error) {
        return {
            EC: -1,
            EM: 'Something went wrong on the server',
        };
    }
};

const getUserFavorites = async (userId, options) => {
    if (userId && options && options.limit && options.page) {
        try {
            let page = parseInt(options.page);
            let limit = parseInt(options.limit);
            let offset = (page - 1) * limit;

            let whereClause = {
                userId: userId
            };

            // Thêm điều kiện lọc theo categoryId
            if (options.categoryId) {
                whereClause['$Product.categoryId$'] = options.categoryId;
            }

            // Thêm điều kiện lọc theo productName
            if (options.productName) {
                whereClause['$Product.name$'] = literal(`LOWER(name) LIKE LOWER('%${options.productName}%') COLLATE utf8mb4_unicode_ci`)
            }

            let { count, rows } = await db.Favorite.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: db.Product,
                    },
                ],
                offset: offset,
                limit: limit,
            });

            return {
                EC: 0,
                EM: 'Get user favorites successfully',
                DT: {
                    totalRows: count,
                    totalPages: Math.ceil(count / limit),
                    favorites: rows
                },
            };
        } catch (error) {
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
};


const removeFromFavorites = async (userId, productId) => {
    try {
        const favorite = await db.Favorite.destroy({
            where: {
                userId: userId,
                productId: productId
            }
        })

        return {
            EC: 0,
            EM: 'Removed from favorites successfully',
        };
    } catch (error) {
        return {
            EC: -1,
            EM: 'Something went wrong on the server',
        };
    }
};

module.exports = {
    addToFavorites,
    getUserFavorites,
    removeFromFavorites
}