import express from "express"
import apiController from "../controller/apiController"
import { checkUserJWT, checkUserPermission } from "../middleware/JWTAction";

const router = express.Router()



const initApiRoutes = (app) => {

    router.all('*', checkUserJWT)
    // rest api
    router.post("/register", apiController.handleRegisterNewUser)
    router.post("/login", apiController.handleLogin)
    router.post("/logout", apiController.handleLogOut)
    router.get("/account", apiController.handlegetUserAccount)
    router.post('/update-user-info', apiController.handleUpdateUserInfo)
    router.post('/update-password', apiController.handleUpdatePassword)

    router.post("/create-product", apiController.handleCreateProduct)
    router.get("/get-product", apiController.handleGetProduct)
    router.post("/update-product", apiController.handleUpdateProduct)
    router.get("/get-own-product", apiController.handleGetOwnerProduct)
    router.get('/get-dashboard-product', apiController.handleGetDashboardProduct)
    router.post('/place-bid', apiController.handlePlaceBid)
    router.post('/get-bid-history', apiController.handleGetBidHistory)
    router.get('/get-user-auction-stats', apiController.handleGetUserAuctionStats)
    router.get('/get-user-bidding-history', apiController.handleGetUserBiddingHistory)
    router.get('/get-user-finished-bidding-history', apiController.handleGetFinishedBidHistory)
    router.get('/get-won-products', apiController.handleGetWonProducts)
    router.post("/pay-product", apiController.handlePayProduct)

    router.post("/create-category", apiController.handleCreateCategory)
    router.get('/get-category', apiController.handleGetCategory)

    router.post("/add-favorite", apiController.handleAddToFavorites)
    router.post("/remove-favorite", apiController.handleRemoveFromFavorites)
    router.get("/get-favorite", apiController.handleGetUserFavorites)

    return app.use("/api", router)
}

export default initApiRoutes