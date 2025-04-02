/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Router, Request, Response} from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.render('index', {
    title: 'MSAL Node & Express Web App',
    isAuthenticated: req.session.isAuthenticated,
    username:
      req.session.account?.username !== ''
        ? req.session.account?.username
        : req.session.account?.name,
  });
});

export default router;