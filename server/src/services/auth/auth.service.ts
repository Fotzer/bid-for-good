import prisma from '../../client';
import { expireTimeInMilliseconds } from '../../common/constants/token.constants';
import HTTPError from '../../common/errors/http-error';
import InternalServerError from '../../common/errors/internal-server-error';
import UserErrorMessage from '../../common/errors/messages/user.error.message';
import NotFoundError from '../../common/errors/not-found-error';
import AuthLoginDto from '../../common/types/auth/auth.login.dto';
import jwt from 'jsonwebtoken';
import UserService from '../user/user.service';
import { User } from '@prisma/client';
import validateSchema from '../../helpers/validate-schema';
import { loginSchema } from '../../common/joi schemas/auth/auth';
import AuthLoginResponseDto from '../../common/types/auth/auth.login.response.dto';

class AuthService {
  userService = new UserService();

  async login(loginData: AuthLoginDto): Promise<AuthLoginResponseDto | undefined> {
    try {
      validateSchema(loginSchema(), loginData);

      const user = await prisma.user.findUnique({
        where: {
          email: loginData.email,
          password: loginData.password
        }
      });

      if (!user) {
        throw new NotFoundError(UserErrorMessage.notFound);
      }

      let token = await prisma.token.findUnique({
        where: {
          userId: user.id
        }
      });

      if (!token) {
        const tokenString = jwt.sign({ email: loginData.email }, process.env.JWT_SECRET!);

        token = await prisma.token.create({
          data: {
            token: tokenString,
            userId: user.id,
            expires: new Date(new Date().getTime() + expireTimeInMilliseconds)
          }
        });
      }

      return {
        user: user,
        token: token.token
      };
    } catch (e) {
      if (e instanceof HTTPError) {
        throw e;
      } else if (e instanceof Error) {
        throw new InternalServerError(e.message);
      }
    }
  }

  async signUp(data: User) {
    return this.userService.create(data);
  }
}

export default AuthService;
