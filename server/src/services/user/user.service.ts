import { User } from '@prisma/client';
import HTTPError from '../../common/errors/http-error';
import InternalServerError from '../../common/errors/internal-server-error';
import prisma from '../../client';
import ConflictError from '../../common/errors/conflict-error';
import UserErrorMessage from '../../common/errors/messages/user.error.message';
import jwt from 'jsonwebtoken';
import UserCreateResponseDto from '../../common/types/user/user.create.response.dto';
import { expireTimeInMilliseconds } from '../../common/constants/token.constants';
import BadRequestError from '../../common/errors/bad-request-error';
import { passwordValidator } from '../../validators/user/password-validator';
import { ZodError } from 'zod';
import { userCreateJoiSchema } from '../../common/joi schemas/user/user';
import validateSchema from '../../helpers/validate-schema';

class UserService {
  async create(userData: User): Promise<UserCreateResponseDto | undefined> {
    try {
      validateSchema(userCreateJoiSchema(), userData);

      try {
        passwordValidator.parse(userData.password);
      } catch (e) {
        if (e instanceof ZodError) {
          throw new BadRequestError(e.errors[0].message);
        }
      }

      const existingUser = await prisma.user.findUnique({
        where: {
          email: userData.email
        }
      });

      if (existingUser) {
        throw new ConflictError(UserErrorMessage.alreadyExists);
      }

      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: userData.password
        }
      });

      const token = jwt.sign({ email: userData.email, userId: user.id }, process.env.JWT_SECRET!);

      await prisma.token.create({
        data: {
          token: token,
          userId: user.id,
          expires: new Date(new Date().getTime() + expireTimeInMilliseconds)
        }
      });

      return {
        user: user,
        token: token
      };
    } catch (e) {
      if (e instanceof HTTPError) {
        throw e;
      } else if (e instanceof Error) {
        throw new InternalServerError(e.message);
      }
    }
  }
}

export default UserService;
