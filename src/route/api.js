import express from "express"
import apiController from "../controller/apiController"
import { checkUserJWT, checkUserPermission } from "../middleware/JWTAction";

const router = express.Router()



const initApiRoutes = (app) => {

    router.all('*', checkUserJWT)
    // rest api
    router.post("/register", apiController.handleRegisterNewUser)
    router.post("/login", apiController.handleLogin)
    router.get("/account", apiController.handlegetUserAccount)

    router.post("/create-product", apiController.handleCreateProduct)
    router.get("/get-product", apiController.handleGetProduct)

    return app.use("/api", router)
}

export default initApiRoutes