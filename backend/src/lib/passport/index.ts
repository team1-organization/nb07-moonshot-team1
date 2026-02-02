import passport from 'passport';
import localStrategy from './localStrategy';
import { accessTokenStrategy, refreshTokenStrategy } from './jwtStrategy';

passport.use('local', localStrategy);
passport.use('accessToken', accessTokenStrategy);
passport.use('refreshToken', refreshTokenStrategy);
export default passport;
