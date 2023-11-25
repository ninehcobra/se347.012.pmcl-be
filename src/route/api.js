import express from "express"
import apiController from "../controller/apiController"

const router = express.Router()



const initApiRoutes = (app) => {
    router.get("/about", (req, res) => {
        return res.send('vailz')
    })

    // rest api
    router.get("/test-api", apiController.testApi)

    router.get("/get-all-province", apiController.getAllProvince)
    router.get("/get-district-by-id", apiController.getDistrictById)

    router.post("/register", apiController.handleRegister)

    return app.use("/api", router)
}

export default initApiRoutes