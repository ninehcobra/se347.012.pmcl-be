import db from "../models"

let getProvinceService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Province.findAll()
            let res = {}
            res.errCode = 0;
            res.data = data
            resolve(res)
        } catch (error) {
            reject(error)
        }
    })
}

let getDistrictById = (provinceId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!provinceId) {
                resolve({
                    errCode: 1,
                    message: "Missing required parameters"
                })
            }
            else {
                let res = {}
                let districtArr = await db.District.findAll({
                    where: { provinceId: provinceId }
                });
                res.errCode = 0;
                res.data = districtArr
                resolve(res)
            }


        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    getProvinceService,
    getDistrictById
}