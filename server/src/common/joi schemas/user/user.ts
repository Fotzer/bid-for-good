import joi from 'joi';

function userCreateJoiSchema() {
  return joi
    .object({
      email: joi.string().required(),
      name: joi.string(),
      password: joi.string().required(),
      role: joi.string()
    })
    .required();
}

export { userCreateJoiSchema };
