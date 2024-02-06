import express from "express";
import controllerHandleErrors from "../../helpers/controller-handle-errors";
import UserService from "../../services/user/user.service";

const userController = express.Router();

const userService = new UserService;

userController.post("/", async (req, res) => {
    res.send(await controllerHandleErrors(res, () => userService.create(req.body)));
});

export default userController;
