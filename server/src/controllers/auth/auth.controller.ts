import express from "express";
import controllerHandleErrors from "../../helpers/controller-handle-errors";
import AuthService from "../../services/auth/auth.service";

const authController = express.Router();

const authService = new AuthService;

authController.post("/login", async (req, res) => {
    res.send(await controllerHandleErrors(res, () => authService.login(req.body)));
});

authController.post("/sign-up", async (req, res) => {
    res.send(await controllerHandleErrors(res, () => authService.signUp(req.body)));
});

export default authController;
