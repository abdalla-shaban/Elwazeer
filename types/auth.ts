export interface ILoginCredentials {
  email: string;
  password: string;
}
export interface IRegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface IUserRoleResponse {
  message: string;
  users: User[];
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
