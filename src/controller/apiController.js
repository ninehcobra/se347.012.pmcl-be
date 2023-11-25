import addressService from "../service/addressService"

const testApi = (req, res) => {
    console.log('call from mobile')
    return res.status(200).json({
        message: 'ok',
        data: 'test api'
    })
}

const handleRegister = (req, res) => {
    console.log('dang ky ne', req.body)
}

const getAllProvince = async (req, res) => {
    try {
        let data = await addressService.getProvinceService()
        return res.status(200).json({
            data: data,
            errCode: 0,
            message: 'Success'
        })
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        })
    }
}

const getDistrictById = async (req, res) => {
    console.log(req.query.provinceId)
    try {

        let data = await addressService.getDistrictById(req.query.provinceId);
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        })
    }
}

module.exports = {
    testApi,
    handleRegister,
    getAllProvince,
    getDistrictById
}