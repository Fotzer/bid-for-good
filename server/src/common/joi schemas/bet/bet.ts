import joi from "joi";

function betJoiSchema() {
    return joi.object({
        betValue: joi.number()
    }).required();
}

export { 
    betJoiSchema,
};
