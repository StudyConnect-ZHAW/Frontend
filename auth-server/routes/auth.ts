import { Router } from 'express';
import { signIn, signOut, handleRedirect } from '../controller/authController';

const router = Router();

router.get('/signin', signIn);
router.get('/signout', signOut);
router.post('/redirect', handleRedirect);

export default router;