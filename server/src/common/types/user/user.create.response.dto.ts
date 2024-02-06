import { User } from "@prisma/client";

type UserCreateResponseDto = {
    user: User,
    token: string
}

export default UserCreateResponseDto;
