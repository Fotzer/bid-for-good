import joi from "joi";

function auctionCreateJoiSchema() {
    return joi.object({
        startPrice: joi.number(),
        name: joi.string().required(),
        description: joi.string().required(),
    }).required();
}

function auctionUpdateJoiSchema() {
    return joi.object({
        startPrice: joi.number(),
        name: joi.string(),
        description: joi.string(),
    }).required();
}

export { 
    auctionCreateJoiSchema,
    auctionUpdateJoiSchema
};
