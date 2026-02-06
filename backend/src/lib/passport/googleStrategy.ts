import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from '../prisma';
import { User } from '../../types/user.type';
import { NotFoundError } from '../../errors/NotFoundError';
import { GOOGLE_CALLBACK_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../../lib/constants';

const googleStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    const email = profile.emails?.[0].value;

    if (!email) {
      return done(new NotFoundError('잘못된 요청입니다'), false);
    }
    let user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return done(new NotFoundError('회원가입을 진행해주세요.'), false);
    }
    if (!user.provider || !user.provider_id) {
      user = await prisma.user.update({
        where: { id: BigInt(user.id) },
        data: {
          provider: 'GOOGLE',
          provider_id: profile.id,
        },
      });
    }

    return done(null, User.fromEntity(user));
  },
);
export default googleStrategy;
