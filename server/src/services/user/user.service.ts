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
import { userCreateJoiSchema, userUpdateJoiSchema } from '../../common/joi schemas/user/user';
import validateSchema from '../../validators/validate-schema';
import { hash } from '../../helpers/bcrypt/bcrypt';
import { emailValidator } from '../../validators/user/email.validator';
import verifyToken from '../../helpers/verify-token';
import NotFoundError from '../../common/errors/not-found-error';

class UserService {
  async get(id: number) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: id
        }
      });

      if(!user) {
        throw new NotFoundError();
      }

      return user;
    } catch (e) {
      if (e instanceof HTTPError) {
        throw e;
      } else if (e instanceof Error) {
        throw new InternalServerError(e.message);
      }
    }
  }

  async changeName(token: string | undefined, userData: User) {
    try {
      validateSchema(userUpdateJoiSchema(), userData);

      const user = verifyToken(token);

      const updatedUser = await prisma.user.update({
        where: {
          id: user!.userId
        },
        data: {
          name: userData.name
        }
      });

      return updatedUser;
    } catch (e) {
      if (e instanceof HTTPError) {
        throw e;
      } else if (e instanceof Error) {
        throw new InternalServerError(e.message);
      }
    }
  }

  async create(userData: User): Promise<UserCreateResponseDto | undefined> {
    try {
      validateSchema(userCreateJoiSchema(), userData);

      try {
        passwordValidator.parse(userData.password);
        emailValidator.parse(userData.email);
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
          ...userData,
          password: await hash(userData.password)
        }
      });

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
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
