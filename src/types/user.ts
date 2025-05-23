export interface User {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserCreate {
  userGuid: string;
  firstName: string;
  lastName: string;
  email: string;
}