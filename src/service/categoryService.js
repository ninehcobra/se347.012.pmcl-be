import db from "../models/index"

const createCategory = async (name) => {
    try {
        if (name) {
            let check = await db.Category.findOne({
                where: {
                    name: name
                }
            })

            if (!check) {
                await db.Category.create(
                    {
                        name: name
                    }
                )
                return {
                    EC: 0,
                    EM: 'Create success',
                }
            }
            else {
                return {
                    EC: 2,
                    EM: 'This category has already exist',
                }
            }


        }
        else {
            return {
                EC: 1,
                EM: 'Missing parameters'
            }
        }
    } catch (error) {
        return {
            EC: -1,
            EM: 'Something wrong on server'
        }
    }
}

const getCategory = async () => {
    try {

        let categories = await db.Category.findAll({
            attributes: ['id', 'name']
        })
        return {
            EC: 0,
            EM: 'Get categories success',
            DT: categories
        }


    } catch (error) {
        return {
            EC: -1,
            EM: 'Something wrong on server'
        }
    }
}

module.exports = {
    createCategory,
    getCategory
}