import { User } from '@prisma/client';
import prisma from '../../client';
import UserService from './user.service';

describe('UserService', () => {
  let userService: UserService;

  beforeAll(async () => {
    userService = new UserService();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  afterEach(async () => {
    try {
      await prisma.user.delete({ where: { email: 'john@gmail.com' } });
    } catch {}
  });

  beforeEach(async () => {
    try {
      await prisma.user.delete({ where: { email: 'john@gmail.com' } });
    } catch {}
  });

  describe('create', () => {
    it('should create a user', async () => {
      const mockUser = { name: 'John Doe', email: 'john@gmail.com', password: 'pa1X!ssword123' };

      const result = await userService.create(mockUser as User);

      const { id: _, ...user } = result!.user;

      expect(user).toEqual({ ...mockUser, password: undefined });
      await prisma.user.delete({ where: { email: mockUser.email } });
    });
  });

  describe('changeName', () => {
    it('should change name of a user', async () => {
      const mockUser = { name: 'John Doe', email: 'john@gmail.com', password: 'pa1X!ssword123' };
      const newName = { name: 'John Doe1' };

      const result = await userService.create(mockUser as User);
      const updated = await userService.changeName(result?.token, newName as User);

      expect(updated?.name).toEqual(newName.name);
      await prisma.user.delete({ where: { email: mockUser.email } });
    });

    it('shouldnt change name of a user if invalid token', async () => {
      const newName = { name: 'John Doe1' };

      await expect(userService.changeName('', newName as User)).rejects.toThrow('Not Authorized');
    });
  });

  describe('get', () => {
    it('should return a user if found', async () => {
      const mockUser = await prisma.user.upsert({
        where: {
          email: 'john@gmail.com'
        },
        update: {},
        create: {
          name: 'John Doe',
          email: 'john@gmail.com',
          password: 'password123'
        }
      });

      const result = await userService.get(mockUser.id);

      expect(result).toEqual(mockUser);
    });

    it('should throw Not Found if user is not found', async () => {
      await expect(userService.get(999)).rejects.toThrow('Not Found');
    });
  });
});
