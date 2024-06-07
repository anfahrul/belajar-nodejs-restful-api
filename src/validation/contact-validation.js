import Joi from "joi";

const createContactValidation = Joi.object({
    first_name: Joi.string().max(100).required(),
    last_name: Joi.string().max(100).optional(),
    phone: Joi.string().max(50).optional(),
    email: Joi.string().email().max(50).optional(),
})

const getContactValidation = Joi.number().required().positive()

const updateContactValidation = Joi.object({
    id: Joi.number().required().positive(),
    first_name: Joi.string().max(100).optional(),
    last_name: Joi.string().max(100).optional(),
    phone: Joi.string().max(50).optional(),
    email: Joi.string().email().max(50).optional()
})

const deleteContactValidation = Joi.number().required().positive()

export {
    createContactValidation,
    getContactValidation,
    updateContactValidation,
    deleteContactValidation
}