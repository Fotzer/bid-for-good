import express from "express";
import controllerHandleErrors from "../../../helpers/controller-handle-errors";
import BetService from "../../../services/auction/bet/bet.service";
import transformBetMiddleware from "../../../middlewares/bet/bet.transform";

const betController = express.Router();

const betService = new BetService;


betController.post("/:auctionId/bets", transformBetMiddleware, async (req, res) => {
    res.send(await controllerHandleErrors(res, () => betService.create(req.headers['authorization'], req.params.auctionId, req.body)));
});

export default betController;
