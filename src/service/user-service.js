import { ResponseError } from "../error/response-error.js";
import { prismaClient } from "../application/database.js";
import { registerUserValidation, loginUserValidation, getUserValidation, updateUserValidation } from "../validation/user-validation.js"
import { validate } from "../validation/validation.js"
import bcrypt from "bcrypt"
import { v4 as uuidv4 } from 'uuid';
import { logger } from "../application/logging.js";

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    const userCount = await prismaClient.user.count({
        where: {
            username: user.username
        }
    })

    if (userCount === 1) {
        throw new ResponseError(400, "User already exist")
    }

    user.password = await bcrypt.hash(user.password, 10)

    return await prismaClient.user.create({
        data:user,
        select: {
            username: true,
            name: true
        }
    })
}

const login = async (request) => {
    const loginRequest = validate(loginUserValidation, request)

    const user = await prismaClient.user.findUnique({
        where: {
            username: loginRequest.username
        },
        select: {
            username: true,
            password: true
        }
    })

    if (!user) {
        throw new ResponseError(401, "username or password wrong")
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
    if (!isPasswordValid) {
        throw new ResponseError(401, "Username or password wrong");
    }

    return prismaClient.user.update({
        data: {
            token: uuidv4()
        },
        where: {
            username: user.username
        },
        select: {
            token: true
        }
    })
}

const get = async (username) => {
    username = validate(getUserValidation, username)

    const user = await prismaClient.user.findUnique({
        where: {
            username: username
        },
        select: {
            username: true,
            name: true
        }
    })

    if (!user) {
        throw new ResponseError(404, "User not found")
    }

    return user
}

const update = async (request) => {
    const userRequest = validate(updateUserValidation, request)

    const userCount = await prismaClient.user.count({
        where: {
            username: userRequest.username
        }
    })

    if (userCount !== 1) {
        throw new ResponseError(404, "User not found")
    }

    const data = {}
    if (userRequest.password) {
        data.password = data.password = await bcrypt.hash(userRequest.password, 10);
    }

    if (userRequest.name) {
        data.name = userRequest.name
    }

    return prismaClient.user.update({
        where: {
            username: userRequest.username
        },
        data: data,
        select: {
            username: true,
            name: true
        }
    })
}

const logout = async (username) => {
    username = validate(getUserValidation, username)

    const user = await prismaClient.user.findUnique({
        where: {
            username: username
        }
    })

    if (!user) {
        throw new ResponseError(404, "User not found")
    }

    return prismaClient.user.update({
        where: {
            username: username
        },
        data: {
            token: null
        },
        select: {
            username: true
        }
    })
}

export default {
    register,
    login,
    get,
    update,
    logout
}