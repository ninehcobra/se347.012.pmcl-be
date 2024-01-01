import express from "express"
import configViewEngine from "./config/viewEngine"
import initWebRoutes from "./route/web"
import initApiRoutes from "./route/api"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import { createJWT, verifyToken } from "./middleware/JWTAction"
import morgan from "morgan"
import compression from "compression"
import helmet from "helmet";
import productService from "./service/productService"
import bidService from "./service/bidService"


dotenv.config()

const app = express()
// const server = require('http').createServer(app);
// const io = require('socket.io')(server, { cors: { origin: 'http://localhost:3000' } });;

const cron = require('node-cron');

// server.listen(3333)
// io.on('connection', (socket) => {
//     console.log('New connection:', socket.id);

//     socket.on('placeBid', (data) => {
//         console.log('Received placeBid:', data);
//         // Xử lý sự kiện ở đây
//         socket.emit('bidPlaced', data)
//     });
// });

cron.schedule('*/5 * * * * *', async () => {
    let res = await productService.findAllExpiredProducts()

    if (res.DT.length > 0) {
        await bidService.setFinishProduct(res.DT[0].id, res.DT[0]['Auctions.winnerId'])

    }

    console.log('Running scheduled task every 5 seconds...');

});

// add middleware
app.use(morgan('dev'))
app.use(compression())
app.use(helmet())

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