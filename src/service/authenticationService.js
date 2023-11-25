import db from "../models/index"
import bcrypt from 'bcrypt'
import { Op } from "sequelize"
import { getGroupWithRoles } from "./JWTService"
import { createJWT } from "../middleware/JWTAction"
require('dotenv').config()

const salt = bcrypt.genSaltSync(10)

const hashPassword = (userPassword) => {
    let hashPassword = bcrypt.hashSync(userPassword, salt);
    return hashPassword
}

const registerNewUser = async (rawUserData) => {
    try {
        if (rawUserData && rawUserData.email && rawUserData.password && rawUserData.name) {
            if (await checkEmail(rawUserData.email)) {
                return {
                    EM: 'Email is already exist',
                    EC: 1
                }
            }
            else {
                let hashpassword = hashPassword(rawUserData.password)

                await db.User.create({
                    email: rawUserData.email,
                    password: hashpassword,
                    name: rawUserData.name,
                    groupId: 2
                })

                return {
                    EM: 'A user is created successfully',
                    EC: 0
                }
            }
        }
        else {
            return {
                EM: 'Missing parameters',
                EC: 2,
            }
        }
    } catch (e) {
        console.log(e)
        return {
            EM: 'Something wrongs in service...',
            EC: -2,
        }
    }
}

const checkEmail = async (userEmail) => {
    let user = await db.User.findOne({
        where: { email: userEmail }
    })
    if (user)
        return true
    return false
}

const login = async (rawUserData) => {
    try {
        if (rawUserData && rawUserData.email && rawUserData.password) {
            let user = await db.User.findOne({
                where: {
                    email: rawUserData.email
                }
            });

            if (user) {
                const match = await bcrypt.compare(rawUserData.password, user.password);
                if (match) {

                    let roles = await getGroupWithRoles(user)
                    let payload = {
                        id: user.id,
                        address: user.address,
                        name: user.name,
                        avatar: user.avatar,
                        phoneNumber: user.phoneNumber,
                        gender: user.gender,
                        email: user.email,
                        roles,
                        expiresIn: process.env.JWT_EXPIRES_IN
                    }
                    let token = createJWT(payload)

                    return {
                        EM: 'success',
                        EC: 0,
                        DT: {
                            access_token: token,
                            roles,
                            email: user.email,
                            name: user.name,
                            avatar: user.avatar,
                            address: user.address,
                            gender: user.gender,
                        }
                    };
                } else {
                    return {
                        EM: 'Wrong password',
                        EC: 3
                    };
                }
            } else {
                return {
                    EM: `This email isn't exist`,
                    EC: 1
                };
            }
        } else {
            return {
                EM: 'Missing parameters',
                EC: 2
            };
        }
    } catch (error) {
        console.error(error);
        return {
            EM: 'Something wrongs in service...',
            EC: -2
        };
    }
};

module.exports = {
    registerNewUser,
    login
}