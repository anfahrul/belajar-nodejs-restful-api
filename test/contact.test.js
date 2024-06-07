import supertest from "supertest"
import {createContactTest, createUserTest, deleteAllContacts, deleteUserTest, getContactTest} from "./test-utils.js"
import { web } from "../src/application/web.js"
import { logger } from "../src/application/logging.js"

describe("POST /api/contacts", function() {
    beforeEach(async () => {
        await createUserTest()
    })

    afterEach(async () => {
        await deleteAllContacts()
        await deleteUserTest()
    })

    it("should can create contact", async () => {
        const result = await supertest(web)
            .post("/api/contacts")
            .set("Authorization", "tokenTest")
            .send({
                "first_name": "spongebob",
                "last_name": "squarepants",
                "phone": "6212345678901",
                "email": "spongebob@example.com"
            })

        expect(result.status).toBe(200)
        expect(result.body.data.id).toBeDefined()
        expect(result.body.data.first_name).toBe("spongebob")
        expect(result.body.data.last_name).toBe("squarepants")
        expect(result.body.data.phone).toBe("6212345678901")
        expect(result.body.data.email).toBe("spongebob@example.com")
    })
    
    it("should create contact if token is invalid", async () => {
        const result = await supertest(web)
            .post("/api/contacts")
            .set("Authorization", "tokenWrong")
            .send({
                "first_name": "spongebob",
                "last_name": "squarepants",
                "phone": "6212345678901",
                "email": "spongebob@example.com"
            })

        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined()
    })
    
    it("should create contact if first_name is not filled", async () => {
        const result = await supertest(web)
            .post("/api/contacts")
            .set("Authorization", "tokenTest")
            .send({
                "first_name": "",
                "last_name": "squarepants",
                "phone": "6212345678901",
                "email": "spongebob@example.com"
            })

        expect(result.status).toBe(400)
        expect(result.body.errors).toBeDefined()
    })
    
    it("should create contact if others request body is invalid", async () => {
        const result = await supertest(web)
            .post("/api/contacts")
            .set("Authorization", "tokenTest")
            .send({
                "first_name": "spongebob",
                "last_name": "squarepants",
                "phone": "62123456789017776774847577466577574",
                "email": "spongebob"
            })

        expect(result.status).toBe(400)
        expect(result.body.errors).toBeDefined()
    })
})

describe("GET /api/contacts/:contact_id", function () {
    beforeEach(async () => {
        await createUserTest()
        await createContactTest()
    })

    afterEach(async () => {
        await deleteAllContacts()
        await deleteUserTest()
    })

    it("should can get contact", async () => {
        const contactTest = await getContactTest()

        const result = await supertest(web)
            .get("/api/contacts/" + contactTest.id)
            .set("Authorization", "tokenTest")
        
        expect(result.status).toBe(200)
        expect(result.body.data.first_name).toBe(contactTest.first_name)
        expect(result.body.data.last_name).toBe(contactTest.last_name)
        expect(result.body.data.phone).toBe(contactTest.phone)
        expect(result.body.data.email).toBe(contactTest.email)
    })
    
    it("should return 404 if contact_id is not found", async () => {
        const contactTest = await getContactTest()

        const result = await supertest(web)
            .get("/api/contacts/" + (contactTest.id + 1))
            .set("Authorization", "tokenTest")
        
        expect(result.status).toBe(404)
        expect(result.body.errors).toBeDefined()
    })
})

describe("PATCH /api/contacts/:contact_id", () => {
    beforeEach(async () => {
        await createUserTest()
        await createContactTest()
    })

    afterEach(async () => {
        await deleteAllContacts()
        await deleteUserTest()
    })

    it("should can update contact", async () => {
        const contactTest = await getContactTest()

        const result = await supertest(web)
            .patch("/api/contacts/" + contactTest.id)
            .set("Authorization", "tokenTest")
            .send({
                "first_name": "spongebob",
                "last_name": "squarepants",
                "phone": "6212345678901",
                "email": "spongebob@example.com"
            })

        expect(result.status).toBe(200)
        expect(result.body.data.first_name).toBe("spongebob")
        expect(result.body.data.last_name).toBe("squarepants")
        expect(result.body.data.phone).toBe("6212345678901")
        expect(result.body.data.email).toBe("spongebob@example.com")
    })
    
    it("should can update partial data", async () => {
        const contactTest = await getContactTest()

        const result = await supertest(web)
            .patch("/api/contacts/" + contactTest.id)
            .set("Authorization", "tokenTest")
            .send({
                // "first_name": "spongebob",
                "last_name": "squarepants BB",
                "phone": "6212345678901000",
                "email": "spongebob_bb@example.com"
            })

        expect(result.status).toBe(200)
        expect(result.body.data.first_name).toBe("spongebob")
        expect(result.body.data.last_name).toBe("squarepants BB")
        expect(result.body.data.phone).toBe("6212345678901000")
        expect(result.body.data.email).toBe("spongebob_bb@example.com")
    })
    
    it("should reject if contact_id is not found", async () => {
        const contactTest = await getContactTest()

        const result = await supertest(web)
            .patch("/api/contacts/" + contactTest.id + 1)
            .set("Authorization", "tokenTest")
            .send({
                // "first_name": "spongebob",
                "last_name": "squarepants BB",
                "phone": "6212345678901000",
                "email": "spongebob_bb@example.com"
            })

        expect(result.status).toBe(404)
        expect(result.body.errors).toBeDefined()
    })
    
    it("should reject if token is invalid", async () => {
        const contactTest = await getContactTest()

        const result = await supertest(web)
            .patch("/api/contacts/" + contactTest.id + 1)
            .set("Authorization", "tokenWrong")
            .send({
                // "first_name": "spongebob",
                "last_name": "squarepants BB",
                "phone": "6212345678901000",
                "email": "spongebob_bb@example.com"
            })

        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined()
    })
})

describe("DELETE /api/contacts/:contact_id", () => {
    beforeEach(async () => {
        await createUserTest()
        await createContactTest()
    })

    afterEach(async () => {
        await deleteAllContacts()
        await deleteUserTest()
    })

    it("should can update contact", async () => {
        const contactTest = await getContactTest()

        const result = await supertest(web)
            .delete("/api/contacts/" + contactTest.id)
            .set("Authorization", "tokenTest")

        expect(result.status).toBe(200)
        expect(result.body.data).toBe("OK")
    })
    
    it("should error if contact_id is not found", async () => {
        const contactTest = await getContactTest()

        const result = await supertest(web)
            .delete("/api/contacts/" + contactTest.id + 1)
            .set("Authorization", "tokenTest")

        expect(result.status).toBe(404)
        expect(result.body.errors).toBeDefined()
    })
    
    it("should error if token is invalid", async () => {
        const contactTest = await getContactTest()

        const result = await supertest(web)
            .delete("/api/contacts/" + contactTest.id)
            .set("Authorization", "tokenWrong")

        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined()
    })
})