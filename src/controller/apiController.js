import authenticationService from "../service/authenticationService"
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


module.exports = {
    handleRegisterNewUser,
    handleLogin
}