import contactService from "../service/contact-service.js"

const create = async (req, res, next) => {
    try {
        const user = req.user
        const request = req.body

        const result = await contactService.create(user, request)
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const get = async (req, res, next) => {
    try {
        const user = req.user
        const contactId = req.params.contact_id

        const result = await contactService.get(user, contactId)
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
} 

const update = async (req, res, next) => {
    try {
        const user = req.user
        const reqBody = req.body
        reqBody.id = req.params.contact_id

        const result = await contactService.update(user, reqBody)
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const remove = async (req, res, next) => {
    try {
        const user = req.user
        const contactId = req.params.contact_id

        await contactService.remove(user, contactId)
        res.status(200).json({
            data: "OK"
        })
    } catch (error) {
        next(error)
    }
}

export default {
    create,
    get,
    update,
    remove
}