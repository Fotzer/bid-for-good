import { Schema } from 'joi';
import BadRequestError from '../common/errors/bad-request-error';

function validateSchema<T>(schema: Schema, inputSchema: T) {
  const isValidResult = schema.validate(inputSchema);
  if (isValidResult.error) {
    throw new BadRequestError(isValidResult.error.details[0].message);
  }
}

export default validateSchema;
