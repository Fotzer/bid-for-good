import express from "express";
import controllerHandleErrors from "../../helpers/controller-handle-errors";
import AuctionService from "../../services/auction/auction.service";

const auctionController = express.Router();

const auctionService = new AuctionService;

auctionController.post("/", async (req, res) => {
    res.send(await controllerHandleErrors(res, () => auctionService.create(req.headers['authorization'], req.body)));
});

export default auctionController;
