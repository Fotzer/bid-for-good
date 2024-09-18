import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import prisma from '../../client';
import NotFoundError from '../../common/errors/not-found-error';
import UnauthorizedError from '../../common/errors/unauthorized-error';
import AuthLoginDto from '../../common/types/auth/auth.login.dto';
import { hash } from '../../helpers/bcrypt/bcrypt';
import UserService from '../user/user.service';
import AuthService from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeAll(() => {
    authService = new AuthService();
    userService = new UserService();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  describe('loginByToken', () => {
    it('should return user info if token is valid', async () => {
      try {
        await prisma.user.delete({ where: { email: 'john@gmail.com' } });
      } catch {}

      const mockUser = await prisma.user.create({
        data: { name: 'John Doe', email: 'john@gmail.com', password: 'hashed-password' }
      });

      const mockToken = jwt.sign({ userId: mockUser.id }, process.env.JWT_SECRET!);

      const result = await authService.loginByToken(mockToken);

      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        iat: undefined
      });
    });

    it('should throw UnauthorizedError if token verification fails', async () => {
      await expect(authService.loginByToken('invalid-token')).rejects.toThrow(UnauthorizedError);
    });

    it('should throw NotFoundError if user is not found', async () => {
      const mockToken = jwt.sign({ userId: 999 }, process.env.JWT_SECRET!);

      await expect(authService.loginByToken(mockToken)).rejects.toThrow(NotFoundError);
    });
  });

  describe('login', () => {
    it('should return user and token if login data is valid', async () => {
      const mockUser = await prisma.user.create({
        data: {
          name: 'John Doe',
          email: 'john@gmail.com',
          password: await hash('password123')
        }
      });
      const mockLoginData: AuthLoginDto = { email: mockUser.email, password: 'password123' };

      const result = await authService.login(mockLoginData);

      expect(result?.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name
      });

      expect(jwt.verify(result!.token, process.env.JWT_SECRET!)).toBeTruthy();
    });

    it('should throw NotFoundError if user is not found', async () => {
      const mockLoginData: AuthLoginDto = { email: 'notfound@gmail.com', password: 'password123' };

      await expect(authService.login(mockLoginData)).rejects.toThrow(NotFoundError);
    });

    it('should throw UnauthorizedError if password is incorrect', async () => {
      const mockLoginData = {
        email: 'johns@gmail.com',
        password: 'wrong1A!password'
      };
      try {
        await userService.create({ ...mockLoginData, name: 'asfd' } as User);
      } catch {}

      await expect(authService.login({ ...mockLoginData, password: 'd' })).rejects.toThrow(
        UnauthorizedError
      );
    });
  });

  describe('signUp', () => {
    it('should create a new user', async () => {
      const mockUser = {
        email: 'john@gmail.com',
        name: 'John Doe',
        password: await hash('password123')
      };

      const result = await authService.signUp(mockUser as User);
      const { user } = result!;

      const createdUser = await prisma.user.findUnique({ where: { email: mockUser.email } });

      expect({ ...createdUser, createdAt: undefined, updatedAt: undefined }).toEqual({
        id: user.id,
        email: user.email,
        name: user.name,
        password: createdUser?.password
      });
    });
  });
});
