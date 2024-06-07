import { ResponseError } from "../error/response-error.js"

const validate = (schema, request) => {
    const { value, error } = schema.validate(request, {
        abortEarly: false,
        allowUnknown: false
    })

    if (error) {
        throw new ResponseError(400, error.message)
    } else {
        return value
    }
}

export {
    validate
}