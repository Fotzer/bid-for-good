import express from 'express';
import controllerHandleErrors from '../../helpers/controller-handle-errors';
import AuthService from '../../services/auth/auth.service';
import HTTPStatus from '../../common/enums/http-status';

const authController = express.Router();

const authService = new AuthService();

authController.post('/login', async (req, res) => {
  res.send(await controllerHandleErrors(res, () => authService.login(req.body)));
});

authController.post('/sign-up', async (req, res) => {
  res.statusCode = HTTPStatus.Created.status;
  res.send(await controllerHandleErrors(res, () => authService.signUp(req.body)));
});

authController.post('/login-by-token', async (req, res) => {
  res.send(await controllerHandleErrors(res, () => authService.loginByToken(req.headers['authorization'])));
});

export default authController;
