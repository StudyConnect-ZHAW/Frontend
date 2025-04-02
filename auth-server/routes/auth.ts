import { Router } from 'express';
import { signIn, signOut, handleRedirect } from '../controller/authController.js';

const router = Router();

router.get('/signin', signIn);
router.get('/signout', signOut);
router.post('/redirect', handleRedirect);

export default router;