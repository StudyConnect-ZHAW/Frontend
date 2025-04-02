/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

/**
 * Custom middleware to check if user is authenticated.
 */
function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
  if (!req.session.isAuthenticated) {
    return res.redirect('/auth/signin'); // redirect to sign-in route
  }

  next();
}

router.get(
  '/id',
  isAuthenticated, // check if user is authenticated
  async (req: Request, res: Response) => {
    res.render('id', {
      idTokenClaims: req.session.account?.idTokenClaims,
    });
  }
);

export default router;