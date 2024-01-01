import db from "../models/index"
import bcrypt from 'bcrypt'
import { Op } from "sequelize"
import { getGroupWithRoles } from "./JWTService"
import { createJWT } from "../middleware/JWTAction"
import user from "../models/user"
require('dotenv').config()

const salt = bcrypt.genSaltSync(10)

const hashPassword = (userPassword) => {
    let hashPassword = bcrypt.hashSync(userPassword, salt);
    return hashPassword
}

const registerNewUser = async (rawUserData) => {
    try {
        if (rawUserData && rawUserData.email && rawUserData.password && rawUserData.name && rawUserData.phoneNumber && rawUserData.address) {
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
                    phoneNumber: rawUserData.phoneNumber,
                    address: rawUserData.address,
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
                            phoneNumber: user.phoneNumber
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

const updateUser = async (userId, updatedData) => {
    if (userId && updatedData) {
        console.log(updatedData)
        try {
            // Kiểm tra xem người dùng có tồn tại không
            const user = await db.User.findByPk(userId);

            if (!user) {
                return {
                    EC: -1,
                    EM: 'User not found',
                };
            }

            // Thực hiện cập nhật thông tin người dùng
            await user.update(updatedData);
            console.log(user)

            return {
                EC: 0,
                EM: 'Update user success',
            };
        } catch (error) {
            console.error('Error updating user:', error);

            return {
                EC: -2,
                EM: 'Something went wrong on the server',
            };
        }
    }
    else {
        return {
            EC: -3,
            EM: 'Missing parameters'
        }
    }
};

const updatePassword = async (rawUserData) => {
    try {
        if (rawUserData && rawUserData.userId && rawUserData.oldPassword && rawUserData.newPassword) {
            const user = await db.User.findOne({
                where: {
                    id: rawUserData.userId
                }
            });

            if (user) {
                const match = await bcrypt.compare(rawUserData.oldPassword, user.password);
                if (match) {
                    const hashNewPassword = hashPassword(rawUserData.newPassword);
                    await db.User.update({
                        password: hashNewPassword
                    }, {
                        where: {
                            id: rawUserData.userId
                        }
                    });

                    return {
                        EM: 'Password updated successfully',
                        EC: 0
                    };
                } else {
                    return {
                        EM: 'Wrong old password',
                        EC: 3
                    };
                }
            } else {
                return {
                    EM: 'User not found',
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
            EM: 'Something went wrong in the service',
            EC: -2
        };
    }
};

module.exports = {
    registerNewUser,
    login,
    updateUser,
    updatePassword
}