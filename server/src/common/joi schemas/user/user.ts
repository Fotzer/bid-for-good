import joi from 'joi';

function userCreateJoiSchema() {
  return joi
    .object({
      email: joi.string().required(),
      name: joi.string(),
      password: joi.string().required()
    })
    .required();
}

function userUpdateJoiSchema() {
  return joi
    .object({
      name: joi.string()
    })
    .required();
}

export { userCreateJoiSchema, userUpdateJoiSchema};
