type AuthLoginResponseDto = {
  token: string;
  user: {
    id: number,
    email: string,
    name: string | null
  };
};

export default AuthLoginResponseDto;
