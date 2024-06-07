import supertest from "supertest"
import { web } from "../src/application/web.js"
import { prismaClient } from "../src/application/database.js"
import { logger } from "../src/application/logging.js"
import { createUserTest, deleteUserTest, getUserTest } from "./test-utils.js"
import bcrypt from "bcrypt"

describe("POST /api/users/register", function () {
    afterEach(async () => {
        await deleteUserTest()
    })

    it("should can register new user", async () => {
        const result = await supertest(web)
            .post("/api/users/register")
            .send({
                "username": "patrick",
                "password": "pass7890",
                "name": "patrick star"
            })

        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe("patrick")
        expect(result.body.data.name).toBe("patrick star")
        expect(result.body.data.password).toBeUndefined()
    })

    it('should reject if request is invalid', async () => {
        const result = await supertest(web)
            .post('/api/users/register')
            .send({
                username: '',
                password: '',
                name: ''
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it("should reject if user has already registered", async () => {
        const result = await supertest(web)
            .post("/api/users/register")
            .send({
                "username": "patrick",
                "password": "pass7890",
                "name": "patrick star"
            })

        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe("patrick")
        expect(result.body.data.name).toBe("patrick star")
        expect(result.body.data.password).toBeUndefined()

        const result2 = await supertest(web)
            .post("/api/users/register")
            .send({
                "username": "patrick",
                "password": "pass7890",
                "name": "patrick star"
            })

        expect(result2.status).toBe(400)
        expect(result2.body.errors).toBeDefined()
    })
})

describe("POST /api/users/login", function () {
    beforeEach(async () => {
        await createUserTest()
    })

    afterEach(async () => {
        await deleteUserTest()
    })

    it("should can login", async () => {
        const result = await supertest(web)
            .post("/api/users/login")
            .send({
                "username": "patrick",
                "password": "pass7890"
            })
        
        expect(result.status).toBe(200)
        expect(result.body.data.token).toBeDefined()
        expect(result.body.data.token).not.toBe("tokenTest")
    })
    
    it("should reject if request is invalid", async () => {
        const result = await supertest(web)
            .post("/api/users/login")
            .send({
                "username": "",
                "password": ""
            })
        
        expect(result.status).toBe(400)
        expect(result.body.errors).toBeDefined()
    })
    
    it("should reject if username is wrong", async () => {
        const result = await supertest(web)
            .post("/api/users/login")
            .send({
                "username": "wrongUsername",
                "password": "pass7890"
            })
        
        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined()
    })
    
    it("should reject if password is wrong", async () => {
        const result = await supertest(web)
            .post("/api/users/login")
            .send({
                "username": "patric",
                "password": "wrongPassord"
            })
        
        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined()
    })
})

describe("GET /api/users/current", function () {
    beforeEach(async () => {
        await createUserTest()
    })

    afterEach(async () => {
        await deleteUserTest()
    })

    it("should can get user's data", async () => {
        const result = await supertest(web)
            .get("/api/users/current")
            .set("Authorization", "tokenTest")

        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe("patrick")
        expect(result.body.data.name).toBe("patrick star")
    })

    it("should reject if token is invalid", async () => {
        const result = await supertest(web)
            .get("/api/users/current")
            .set("Authorization", "tokenWrong")
        
        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined()
    })
})

describe("PATCH /api/users/update", function () {
    beforeEach(async () => {
        await createUserTest()
    })

    afterEach(async () => {
        await deleteUserTest()
    })

    it("should can updated", async () =>  {
        const result = await supertest(web)
            .patch("/api/users/update")
            .set("Authorization", "tokenTest")
            .send({
                "password": "secret",
                "name": "patrick BB"
            })

        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe("patrick")
        expect(result.body.data.name).toBe("patrick BB")

        const user = await getUserTest()
        expect(await bcrypt.compare("secret", user.password)).toBe(true)
    })
    
    it("should can updated only name", async () =>  {
        const result = await supertest(web)
            .patch("/api/users/update")
            .set("Authorization", "tokenTest")
            .send({
                "name": "patrick BB"
            })

        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe("patrick")
        expect(result.body.data.name).toBe("patrick BB")

        const user = await getUserTest()
        expect(await bcrypt.compare("pass7890", user.password)).toBe(true)
    })
    
    it("should can updated only password", async () =>  {
        const result = await supertest(web)
            .patch("/api/users/update")
            .set("Authorization", "tokenTest")
            .send({
                "password": "secret",
            })

        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe("patrick")
        expect(result.body.data.name).toBe("patrick star")

        const user = await getUserTest()
        expect(await bcrypt.compare("secret", user.password)).toBe(true)
    })
    
    it("should reject if token is invalid", async () =>  {
        const result = await supertest(web)
            .patch("/api/users/update")
            .set("Authorization", "tokenWrong")
            .send({
                "password": "secret",
            })

        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined()
    })
})

describe("DELETE /api/users/logout", function() {
    beforeEach(async () => {
        await createUserTest()
    })

    afterEach(async () => {
        await deleteUserTest()
    })

    it("should can logout", async () => {
        const result = await supertest(web)
            .delete("/api/users/logout")
            .set("Authorization", "tokenTest")
        
        expect(result.status).toBe(200)
        expect(result.body.data).toBe("OK")
    })
    
    it("should reject logout if token is invalid", async () => {
        const result = await supertest(web)
            .delete("/api/users/logout")
            .set("Authorization", "tokenWrong")

            expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined()
    })
})