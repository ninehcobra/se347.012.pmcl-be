import jwt from "jsonwebtoken"
require("dotenv").config()

const nonSecurePaths = ['/', '/register', '/login', '/course', '/get-blog']


const createJWT = (payload) => {

    let token = null
    try {
        token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    } catch (error) {
        console.log('Lỗi tạo token')
    }


    return token
}


let verifyToken = (token) => {

    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log('Tài khoản hết hạn xác thực');
                resolve(null)
            } else {
                resolve(decoded);
            }
        });
    });
}

const checkUserPermission = (req, res, next) => {
    if (nonSecurePaths.includes(req.path) || req.path === '/account') return next();
    if (req.user) {
        let email = req.user.email
        let roles = req.user.roles.Roles
        let currentUrl = req.path
        if (!roles || roles.length === 0) {
            return res.status(403).json({
                EC: -1,
                DT: '',
                EM: `You don't have permission to access this resources`
            })
        }

        let canAccess = roles.some(item => item.url === currentUrl)
        if (canAccess) {
            next()
        }
        else {
            return res.status(403).json({
                EC: -1,
                DT: '',
                EM: `You don't have permission to access this resources`
            })
        }


    }
    else {
        return res.status(401).json({
            EC: -1,
            DT: '',
            EM: 'Not authenticated the user'
        })
    }
}

const extractToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1]
    }
    return null
}

const checkUserJWT = async (req, res, next) => {
    console.log('Đang thực hiện request ở link: ', req.path)
    if (nonSecurePaths.includes(req.path)) return next();
    let cookies = req.cookies;
    const tokenFromHeader = extractToken(req)

    if (cookies && cookies.jwt || tokenFromHeader) {
        let token = cookies && cookies.jwt ? cookies.jwt.access_token : tokenFromHeader
        let decoded = await verifyToken(token)
        if (decoded) {
            req.user = decoded
            req.token = token
            next()
        }
        else {
            return res.status(401).json({
                EC: -1,
                DT: '',
                EM: 'Not authenticated the user'
            })
        }
    }



    else {
        return res.status(401).json({
            EC: -1,
            DT: '',
            EM: 'Not authenticated the user'
        })
    }
}

module.exports = {
    createJWT,
    verifyToken,
    checkUserJWT,
    checkUserPermission
}