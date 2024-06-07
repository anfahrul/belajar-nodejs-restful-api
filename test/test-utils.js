import supertest from "supertest"
import { web } from "../src/application/web.js"
import bcrypt from "bcrypt"
import { prismaClient } from "../src/application/database.js"

const createUserTest = async () => {
    await prismaClient.user.create({
        data: {
            username: "patrick",
            password: await bcrypt.hash("pass7890", 10),
            name: "patrick star",
            token: "tokenTest"
        }
    })
}

const deleteUserTest = async () => {
    await prismaClient.user.deleteMany({
        where: {
            username: "patrick"
        }
    })
}

const getUserTest = async () => {
    return prismaClient.user.findUnique({
        where: {
            username: "patrick"
        }
    })
}

const deleteAllContacts = async () => {
    await prismaClient.contact.deleteMany({
        where: {
            username: "patrick"
        }
    })
}

const createContactTest = async () => {
    await prismaClient.contact.create({
        data: {
            "username": "patrick",
            "first_name": "spongebob",
            "last_name": "squarepants",
            "phone": "6212345678901",
            "email": "spongebob@example.com"
        }
    })
}

const getContactTest = async () => {
    return prismaClient.contact.findFirst({
        where: {
            username: "patrick"
        }
    })
}

export {
    createUserTest,
    deleteUserTest,
    getUserTest,
    deleteAllContacts,
    createContactTest,
    getContactTest
}