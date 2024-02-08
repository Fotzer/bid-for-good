import { User } from '@prisma/client';

type UserCreateResponseDto = {
  user: {
    name: string | null,
    email: string
  };
  token: string;
};

export default UserCreateResponseDto;
