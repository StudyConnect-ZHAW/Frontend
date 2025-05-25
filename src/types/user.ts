/**
 * Represents an individual user.
 */
export interface User {
  userGuid: string;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Payload to create a new user in the backend.
 * Includes the ID provided by the token.
 */
export interface UserCreateData {
  userGuid: string;
  firstName: string;
  lastName: string;
  email: string;
}