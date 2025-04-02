import { Request, Response, NextFunction } from 'express';
import authProvider from '../auth/AuthProvider';

/**
 * Initiates the sign-in process by triggering MSAL login.
 */
export const signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  return authProvider.login(req, res, next);
};

/**
 * Handles the redirect from Azure AD after authentication.
 */
export const handleRedirect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  return authProvider.handleRedirect(req, res, next);
};

/**
 * Signs out the user and destroys the session.
 */
export const signOut = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  return authProvider.logout(req, res, next);
};