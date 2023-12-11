import db from "../models/index"

const createProduct = async (data) => {
    if (data && data.name && data.user) {
        try {

            let res = await db.Product.create({
                name: data.name,
                sellerId: data.user.id
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

const updateProduct = async (data) => {
    let product = data.data
    if (data && product.id) {
        try {

            await db.Product.update({
                name: product.name,
                descriptionMarkdown: product.descriptionMarkdown,
                descriptionHTML: product.descriptionHTML,
                startPrice: product.startPrice,
                jumpPrice: product.jumpPrice,
                startTime: product.startTime,
                endTime: product.endTime,
                categoryId: product.categoryId,
                images: product.images,
                updatedAt: new Date(),

            }, {
                where: {
                    id: product.id
                }
            })
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

        } catch (error) {

        }
    }
    else {
        return {
            EC: -2,
            EM: 'Missing parameters'
        }
    }
}

module.exports = {
    createProduct,
    getProduct,
    updateProduct
}