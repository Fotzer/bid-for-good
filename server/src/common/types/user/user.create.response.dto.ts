type UserCreateResponseDto = {
  user: {
    id: number,
    name: string | null,
    email: string
  };
  token: string;
};

export default UserCreateResponseDto;
