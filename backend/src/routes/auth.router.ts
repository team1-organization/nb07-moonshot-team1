import { Router } from 'express';
import {
  googleLogin,
  login,
  logout,
  refreshTokens,
  register,
} from '../controllers/auth.controller';
import { withAsync } from '../lib/withAsync';
import passport from '../lib/passport';

const router = Router();
router.post('/register', withAsync(register));
router.post(
  '/login',
  passport.authenticate('local', { session: false, failWithError: true }),
  withAsync(login),
);
router.post('/logout', withAsync(logout));
router.post(
  '/refresh',
  passport.authenticate('refreshToken', { session: false, failWithError: true }),
  withAsync(refreshTokens),
);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failWithError: true }),
  withAsync(googleLogin),
);

export default router;
