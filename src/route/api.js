import express from "express"
import apiController from "../controller/apiController"

const router = express.Router()



const initApiRoutes = (app) => {


    // rest api
    router.post("/register", apiController.handleRegisterNewUser)
    router.post("/login", apiController.handleLogin)

    return app.use("/api", router)
}

export default initApiRoutes