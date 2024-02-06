import express from "express";
import userController from "./user/user.controller";

const mainController = express.Router();

mainController.use("/users", userController);

export default mainController;
