import authenticationService from "../service/authenticationService"
import productService from "../service/productService"
const handleRegisterNewUser = async (req, res) => {

    let data = await authenticationService.registerNewUser(req.body)

    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: '',
    })
}

const handleLogin = async (req, res) => {
    let data = await authenticationService.login(req.body)
    if (data && data.DT && data.DT.access_token) {
        res.cookie("jwt", data.DT, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    }


    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
    })
}

const handlegetUserAccount = async (req, res) => {

    return res.status(200).json({
        EC: 0,
        EM: 'success',
        DT: req.user
    })
}

const handleCreateProduct = async (req, res) => {
    req.body.user = req.user

    let data = await productService.createProduct(req.body)
    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
    })
}

const handleGetProduct = async (req, res) => {
    let data = await productService.getProduct(parseInt(req.query.id))
    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
    })
}


module.exports = {
    handleRegisterNewUser,
    handleLogin,
    handlegetUserAccount,
    handleCreateProduct,
    handleGetProduct
}