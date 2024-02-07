import joi from "joi";

function loginSchema() {
    return joi.object({
        email: joi.string().required(),
        password: joi.string().required()
    }).required();
}

export { 
    loginSchema,
};
