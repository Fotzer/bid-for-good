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
import validateSchema from '../../validators/validate-schema';
import { loginSchema } from '../../common/joi schemas/auth/auth';
import AuthLoginResponseDto from '../../common/types/auth/auth.login.response.dto';
import UnauthorizedError from '../../common/errors/unauthorized-error';
import { compare } from '../../helpers/bcrypt/bcrypt';
import verifyToken from '../../helpers/verify-token';

class AuthService {
  userService = new UserService();

  async loginByToken(token: string | undefined) {
    try {
      const userId = verifyToken(token)!.userId;

      const user = await this.userService.get(userId);

      return {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        iat: undefined};
    } catch (e) {
      if (e instanceof HTTPError) {
        throw e;
      } else if (e instanceof Error) {
        throw new InternalServerError(e.message);
      }
    }
  }

  async login(loginData: AuthLoginDto): Promise<AuthLoginResponseDto | undefined> {
    try {
      validateSchema(loginSchema(), loginData);

      const user = await prisma.user.findUnique({
        where: {
          email: loginData.email
        }
      });

      if (!user) {
        throw new NotFoundError(UserErrorMessage.notFound);
      }

      if (!(await compare(loginData.password, user.password))) {
        throw new UnauthorizedError(UserErrorMessage.wrongPassword);
      }


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

  async signUp(data: User) {
    return this.userService.create(data);
  }
}

export default AuthService;
