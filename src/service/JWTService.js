import db from "../models/index"

const getGroupWithRoles = async (user) => {

    let roles = await db.Group.findOne({
        where: { id: user.groupId },
        attributes: ["id", "name", "description"],

        include: {
            model: db.Role,
            attributes: ["id", "url", "description"],
            through: { attributes: [] }
        }
    })



    return roles ? roles : {}

}

const createGroupRole = async (data) => {
    try {
        await db.GroupRole.create(
            {
                roleId: 1,
                groupId: 2
            }
        )
        return {
            EC: 0,
            EM: 'Create grouprole success'
        }
    } catch (error) {
        console.error('Error creating GroupRole:', error);
        return {
            EC: -1,
            EM: 'Something wrong on server'
        }
    }
}

const createRole = async (data) => {
    if (data && data.url && data.description && data.groupId) {
        try {
            let check = await db.Role.findOne({
                where: {
                    url: data.url
                }
            })
            if (check) {
                return {
                    EC: 1,
                    EM: 'Role already exist'
                }
            }
            else {
                let role = await db.Role.create({
                    url: data.url,
                    description: data.description
                })
                if (role) {

                    let id = await parseInt(role.dataValues.id)

                    await db.GroupRole.create({
                        roleId: id,
                        groupId: data.groupId
                    })
                    return {
                        EC: 0,
                        EM: 'Create role success'
                    }
                }
                else {
                    return {
                        EC: -1,
                        EM: 'Something wrong on server--'
                    }
                }

            }
        } catch (error) {
            return {
                EC: -1,
                EM: 'Something wrong on server'
            }
        }
    }
    else {
        return {
            EC: -2,
            EM: 'Missing parameters'
        }
    }
}

module.exports = {
    getGroupWithRoles,
    createRole,
    createGroupRole
}