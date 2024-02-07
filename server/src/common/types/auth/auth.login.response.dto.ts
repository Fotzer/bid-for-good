import { User } from '@prisma/client';

type AuthLoginResponseDto = {
  token: string;
  user: User;
};

export default AuthLoginResponseDto;
