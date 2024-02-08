import express from 'express';
import controllerHandleErrors from '../../helpers/controller-handle-errors';
import UserService from '../../services/user/user.service';
import HTTPStatus from '../../common/enums/http-status';

const userController = express.Router();

const userService = new UserService();

userController.post('/', async (req, res) => {
  res.statusCode = HTTPStatus.Created.status;
  res.send(await controllerHandleErrors(res, () => userService.create(req.body)));
});

export default userController;
