import express from "express"
import homeController from "../controller/homeController"
import apiController from "../controller/apiController"

const router = express.Router()



const initWebRoutes = (app) => {
    router.get("/", homeController.handleHelloWorld)
    router.get("/about", (req, res) => {
        return res.send('vailz')
    })

    // rest api


    return app.use("/", router)
}

export default initWebRoutes