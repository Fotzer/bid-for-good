import express from "express";
import controllerHandleErrors from "../../helpers/controller-handle-errors";
import AuctionService from "../../services/auction/auction.service";
import multer from "multer";
const upload = multer();

const auctionController = express.Router();

const auctionService = new AuctionService;

auctionController.post("/", upload.single('photo'), async (req, res) => {
    console.log(req.file);
    res.send(await controllerHandleErrors(res, () => auctionService.create(req.headers['authorization'], req.body, req.file?.buffer)));
});

export default auctionController;
