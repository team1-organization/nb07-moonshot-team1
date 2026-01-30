import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/lib/prisma';
// npx vitest run user.test.ts

describe('유저 통합 테스트', () => {
  const testUser = {
    email: 'testUser@test.com',
    name: 'testUser',
    password: 'password123',
  };

  let accessToken: string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let refreshToken: string;

  beforeAll(async () => {
    // 테스트 유저 생성 및 로그인 (인증 토큰 확보)
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await request(app).post('/auth/register').send(testUser);
    const loginUser = await request(app).post('/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });
    accessToken = loginUser.body.accessToken;
  });
  describe('유저 조회', () => {
    it('로그인한 유저의 정보를 정확히 반환해야 한다.', async () => {
      const existingUser = await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(existingUser.status).toBe(200);
      expect(existingUser.body).toMatchObject({
        email: testUser.email,
        name: testUser.name,
      });
      expect(existingUser.body).toHaveProperty('id');
    });

    it('존재하지 않는 유저 조회 시 에러를 반환한다', async () => {
      await prisma.user.delete({ where: { email: testUser.email } });
      const user = await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(user.status).toBe(404);
    });

    it('토큰 없이 조회 시 로그인이 필요합니다 메시지를 반환한다', async () => {
      const res = await request(app).get('/users/me');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('로그인이 필요합니다');
    });
  });
});
