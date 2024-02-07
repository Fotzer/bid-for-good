import express from "express";
import controllerHandleErrors from "../../helpers/controller-handle-errors";
import AuctionService from "../../services/auction/auction.service";
import multer from "multer";
import transformAuctionMiddleware from "../../middlewares/auction/transform.auction";
const upload = multer();

const auctionController = express.Router();

const auctionService = new AuctionService;


auctionController.post("/", upload.single('photo'), transformAuctionMiddleware, async (req, res) => {
    res.send(await controllerHandleErrors(res, () => auctionService.create(req.headers['authorization'], req.body, req.file?.buffer)));
});

auctionController.put("/:id", upload.single('photo'), transformAuctionMiddleware, async (req, res) => {
    res.send(await controllerHandleErrors(res, () => auctionService.update(req.headers['authorization'], req.params.id, req.body, req.file?.buffer)));
});

export default auctionController;
