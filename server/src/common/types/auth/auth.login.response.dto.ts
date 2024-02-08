import { User } from '@prisma/client';

type AuthLoginResponseDto = {
  token: string;
  user: {
    email: string,
    name: string | null
  };
};

export default AuthLoginResponseDto;
