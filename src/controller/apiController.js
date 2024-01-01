import authenticationService from "../service/authenticationService"
import productService from "../service/productService"
import categoryService from "../service/categoryService"
import bidService from "../service/bidService"
import favoriteService from "../service/favoriteService"


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

const handleUpdateProduct = async (req, res) => {
    let data = await productService.updateProduct(req.body)
    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
    })
}

const handleCreateCategory = async (req, res) => {
    let data = await categoryService.createCategory(req.body.name)
    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
    })
}

const handleGetCategory = async (req, res) => {
    let data = await categoryService.getCategory()
    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
    })
}

const handleGetOwnerProduct = async (req, res) => {
    let data = await productService.getOwnerProduct(req.user.id, req.query)
    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
    })
}

const handleGetDashboardProduct = async (req, res) => {
    let data = await productService.getDashboardProduct(req.user.id, req.query)
    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
    })
}

const handlePlaceBid = async (req, res) => {
    let data = await bidService.placeBid(req.user.id, req.body.id, req.body.bidAmount)
    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
    })
}

const handleGetBidHistory = async (req, res) => {
    let data = await bidService.getBidHistory(req.body.id)
    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
    })
}

const handleUpdateUserInfo = async (req, res) => {
    let data = await authenticationService.updateUser(req.user.id, req.body)
    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
    })
}

const handleLogOut = async (req, res) => {
    res.cookie("jwt", req.cookie, { expires: new Date(Date.now()) })
    return res.status(200).json({
        EM: "Log out success",
        EC: 0
    })
}

const handleUpdatePassword = async (req, res) => {
    req.body.userId = req.user.id
    let data = await authenticationService.updatePassword(req.body)
    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
    })
}

const handleGetUserAuctionStats = async (req, res) => {
    let data = await bidService.getUserAuctionStats(req.user.id)
    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
    })
}

const handleGetUserBiddingHistory = async (req, res) => {
    let data = await bidService.getUserBiddingHistory(req.user.id, req.query)
    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
    })
}

const handleGetWonProducts = async (req, res) => {
    let data = await productService.getWonProducts(req.user.id)
    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
    })
}

const handleGetFinishedBidHistory = async (req, res) => {
    let data = await bidService.getFinishedBidHistory(req.user.id, req.query)
    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
    })
}

const handleAddToFavorites = async (req, res) => {
    let data = await favoriteService.addToFavorites(req.user.id, req.body.id)
    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
    })
}

const handleRemoveFromFavorites = async (req, res) => {
    let data = await favoriteService.removeFromFavorites(req.user.id, req.body.id)
    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
    })
}

const handleGetUserFavorites = async (req, res) => {
    let data = await favoriteService.getUserFavorites(req.user.id, req.query)
    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
    })
}

const handlePayProduct = async (req, res) => {
    let data = await productService.payProduct(req.body.id)
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
    handleGetProduct,
    handleUpdateProduct,
    handleCreateCategory,
    handleGetCategory,
    handleGetOwnerProduct,
    handleGetDashboardProduct,
    handlePlaceBid,
    handleGetBidHistory,
    handleUpdateUserInfo,
    handleLogOut,
    handleUpdatePassword,
    handleGetUserAuctionStats,
    handleGetUserBiddingHistory,
    handleGetWonProducts,
    handleGetFinishedBidHistory,
    handleAddToFavorites,
    handleRemoveFromFavorites,
    handleGetUserFavorites,
    handlePayProduct
}