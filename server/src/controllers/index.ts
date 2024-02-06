import express from "express";
import userController from "./user/user.controller";
import authController from "./auth/auth.controller";

const mainController = express.Router();

mainController.use("/users", userController);

mainController.use("/auth", authController);

export default mainController;
