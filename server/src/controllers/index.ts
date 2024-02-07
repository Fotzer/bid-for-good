import express from 'express';
import userController from './user/user.controller';
import authController from './auth/auth.controller';
import auctionController from './auction/auction.controller';

const mainController = express.Router();

mainController.use('/users', userController);

mainController.use('/auth', authController);

mainController.use('/auctions', auctionController);

export default mainController;
