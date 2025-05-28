/**
 * Represents an individual user.
 */
export interface User {
  oid: string;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Payload to create a new user in the backend.
 * Includes the ID provided by the token.
 */
export interface UserCreateData {
  oid: string;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Payload to update an existing user in the backend.
 */
export interface UserUpdateData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
}