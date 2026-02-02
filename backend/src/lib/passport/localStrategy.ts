import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { prisma } from '../prisma';
import { LoginBodyStruct } from '../../structs/auth.struct';

const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email: string, password: string, done) => {
    const data = LoginBodyStruct.parse({ email, password });

    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user || !user.password) {
      return done(null, false, { message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
    }
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      return done(null, false, { message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
    }
    return done(null, user);
  },
);
export default localStrategy;
