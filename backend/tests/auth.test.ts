import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../src/app';

// npx vitest run auth.test.ts

const testUser = {
  email: 'testUser@test.com',
  name: 'testUser',
  password: 'password123',
  profileImage: 'https://example.com/files/image.png',
};

let accessToken: string;
let refreshToken: string;

describe('인증 통합 테스트', () => {
  describe('회원가입', () => {
    it('새로운 유저를 성공적으로 생성해야 한다', async () => {
      const createdUser = await request(app).post('/auth/register').send(testUser);
      expect(createdUser.status).toBe(201);
      expect(createdUser.body).toMatchObject({
        email: testUser.email,
        name: testUser.name,
      });
      expect(createdUser.body).toHaveProperty('id');
    });
    it('중복된 이메일로 가입 시 400 에러를 반환해야 한다', async () => {
      const createdUser = await request(app).post('/auth/register').send(testUser);
      expect(createdUser.status).toBe(400);
      expect(createdUser.body.message).toBe('이미 가입한 이메일입니다.');
    });
  });
  describe('로그인', () => {
    it('로그인 시 토큰을 반환해야 한다', async () => {
      const loginUser = await request(app).post('/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });
      expect(loginUser.status).toBe(200);
      expect(loginUser.body).toHaveProperty('accessToken');
      expect(loginUser.body).toHaveProperty('refreshToken');
      // 다음 테스트를 위해 토큰 저장
      accessToken = loginUser.body.accessToken;
      refreshToken = loginUser.body.refreshToken;
    });
    it('존재하지 않거나 비밀번호가 틀리면 에러를 반환해야 한다', async () => {
      const result = await request(app).post('/auth/login').send({
        email: testUser.email,
        password: 'wrongPassword',
      });
      expect(result.status).toBe(404);
      expect(result.body.message).toBe('존재하지 않거나 비밀번호가 일치하지 않습니다');
    });
    it('필수 입력값이 누락되면 에러를 반환해야 한다', async () => {
      const result = await request(app).post('/auth/login').send({
        email: testUser.email,
        //비밀번호 누락
      });
      expect(result.status).toBe(400);
      expect(result.body.message).toBe('잘못된 요청입니다');
    });
  });
  describe('토큰 갱신', () => {
    it('유효한 리프레시 토큰으로 새 토큰을 발급받는다', async () => {
      const res = await request(app)
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${refreshToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
      // 갱신된 토큰으로 업데이트
      accessToken = res.body.accessToken;
    });
    it('토큰 없이 갱신 시도 시 에러를 반환해야 한다', async () => {
      const res = await request(app).post('/auth/refresh');
      expect(res.status).toBe(401);
    });
  });
});
