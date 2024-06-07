import { ResponseError } from "../error/response-error.js"

const errorMiddleware = (err, req, res, next) => {
    if (!err) {
        next()
        return
    } else {
        if (err instanceof ResponseError) {
            res.status(err.statusCode).json({
                errors: err.message
            })
        } else {
            res.status(500).json({
                errors: err.message
            })
        }
    }
}

export {
    errorMiddleware
}