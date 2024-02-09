export interface IUser {
  email: string;
  name: string;
  id: number;
}

export interface IUserSignIn extends Pick<IUser, "email"> {
  password: string;
}

export interface IUserSignUp extends Omit<IUser, "id"> {
  password: string;
}
