import express from "express"
import { authMiddleware } from "../middleware/auth-middleware.js"
import userController from "../controller/user-controller.js"
import contactController from "../controller/contact-controller.js"

const userRouter = express.Router()
userRouter.use(authMiddleware)

// User API
userRouter.get("/api/users/current", userController.get)
userRouter.patch("/api/users/update", userController.update)
userRouter.delete("/api/users/logout", userController.logout)

// Contact API
userRouter.post("/api/contacts", contactController.create)
userRouter.get("/api/contacts/:contact_id", contactController.get)
userRouter.patch("/api/contacts/:contact_id", contactController.update)
userRouter.delete("/api/contacts/:contact_id", contactController.remove)

export {
    userRouter
}