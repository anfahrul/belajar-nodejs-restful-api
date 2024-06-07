import { createContactValidation, deleteContactValidation, getContactValidation, updateContactValidation } from "../validation/contact-validation.js"
import {validate} from "../validation/validation.js"
import {prismaClient} from "../application/database.js"
import { ResponseError } from "../error/response-error.js"

const create = async (user, request) => {
    const contact = validate(createContactValidation, request)
    contact.username = user.username


    return prismaClient.contact.create({
        data: contact,
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true
        }
    })
}

const get = async (user, contactId) => {
    contactId = validate(getContactValidation, contactId)

    const contact = await prismaClient.contact.findFirst({
        where: {
            id: contactId,
            username: user.username
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            phone: true,
            email: true
        }
    })

    if (!contact) {
        throw new ResponseError(404, "Contact not found")
    }

    return contact
}

const update = async (user, request) => {
    const contactRequest = validate(updateContactValidation, request)

    const contactCount = await prismaClient.contact.count({
        where: {
            id: contactRequest.id,
            username: user.username
        }
    })

    if (contactCount != 1) {
        throw new ResponseError(404, "Contact not found")
    }

    const contactData = {}

    if (contactRequest.first_name) {
        contactData.first_name = contactRequest.first_name
    }
    
    if (contactRequest.last_name) {
        contactData.last_name = contactRequest.last_name
    }

    if (contactRequest.email) {
        contactData.email = contactRequest.email
    }
    if (contactRequest.last_name) {
        contactData.phone = contactRequest.phone
    }

    return prismaClient.contact.update({
        where: {
            id: contactRequest.id,
            username: user.username
        },
        data: {
            first_name: contactData.first_name,
            last_name: contactData.last_name,
            phone: contactData.phone,
            email: contactData.email
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            phone: true,
            email: true
        }
    })
}

const remove = async (user, contactId) => {
    contactId = validate(deleteContactValidation, contactId)

    const contactCount = await prismaClient.contact.count({
        where: {
            id: contactId,
            username: user.username
        }
    })

    if (contactCount != 1) {
        throw new ResponseError(404, "contact not found")
    }

    return prismaClient.contact.delete({
        where: {
            id: contactId,
        }
    })  
}

export default {
    create,
    get,
    update,
    remove
}