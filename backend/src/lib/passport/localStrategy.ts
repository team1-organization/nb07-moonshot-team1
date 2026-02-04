import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { prisma } from '../prisma';
import { LoginBodyStruct } from '../../structs/auth.struct';
import { User } from '../../types/user.type';
import { NotFoundError } from '../../errors/NotFoundError';

const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email: string, password: string, done) => {
    const data = LoginBodyStruct.parse({ email, password });
    if (!email || !password) {
      return done(new NotFoundError('잘못된 요청입니다'), false);
    }
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user || !user.password) {
      return done(null, false, { message: '존재하지 않거나 비밀번호가 일치하지 않습니다' });
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      //return done(null, false, { message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
      return done(new NotFoundError('존재하지 않거나 비밀번호가 일치하지 않습니다'), false);
    }
    return done(null, User.fromEntity(user));
  },
);
export default localStrategy;
