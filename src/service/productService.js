import db from "../models/index"

const createProduct = async (data) => {
    if (data && data.name && data.description && data.startPrice && data.currentPrice && data.startTime && data.endTime && data.images && data.user) {
        try {

            await db.Product.create({
                name: data.name,
                description: data.description,
                startPrice: data.startPrice,
                currentPrice: data.currentPrice,
                startTime: data.startTime,
                endTime: data.endTime,
                images: data.images,
                sellerId: data.user.id
            })

            return ({
                EC: 0,
                EM: 'Create prodct success'
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
            let data = await db.Product.findOne({
                where: {
                    id: parseInt(productId)
                }, include: {
                    model: db.User,
                    attributes: ['name', 'id', 'avatar']
                }
            })

            return ({
                EC: 0,
                EM: 'Get product success',
                DT: data
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

module.exports = {
    createProduct,
    getProduct
}