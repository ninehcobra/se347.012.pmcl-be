import express from "express"
import configViewEngine from "./config/viewEngine"
import initWebRoutes from "./route/web"
import initApiRoutes from "./route/api"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import { createJWT, verifyToken } from "./middleware/JWTAction"

dotenv.config()

const app = express()

// fix CORS
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    if (req.method === "OPTIONS") {
        return res.sendStatus(200)
    }
    // Pass to next layer of middleware
    next();
});

// config View engine
configViewEngine(app)

// config cookie parser
app.use(cookieParser())


// config body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// test JWT


//init web routes
initWebRoutes(app)
initApiRoutes(app)

const PORT = process.env.PORT || 8888

app.use((req, res) => {
    return res.send('404 not found')
})

app.listen(PORT, () => {
    console.log(`App is running on the port: http://localhost:${PORT}`)
})