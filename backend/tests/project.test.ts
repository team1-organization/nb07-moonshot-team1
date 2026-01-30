import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../src/app';
// npx vitest run project.test.ts
let adminToken: string;
let otherToken: string;
let projectId: string;

describe('프로젝트 통합 테스트', () => {
  const adminUser = { email: 'admin@test.com', name: '관리자', password: 'password123' };
  const otherUser = { email: 'other@test.com', name: '일반인', password: 'password123' };
  beforeAll(async () => {
    await request(app).post('/auth/register').send(adminUser);
    await request(app).post('/auth/register').send(otherUser);
    const adminLogin = await request(app)
      .post('/auth/login')
      .send({ email: adminUser.email, password: adminUser.password });
    const otherLogin = await request(app)
      .post('/auth/login')
      .send({ email: otherUser.email, password: otherUser.password });

    adminToken = adminLogin.body.accessToken;
    otherToken = otherLogin.body.accessToken;
  });
  describe('프로젝트 생성', () => {
    it('프로젝트를 성공적으로 생성해야 한다', async () => {
      const res = await request(app)
        .post('/projects')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: '프로젝트 1', description: '프로젝트 1 설명' });
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        name: '프로젝트 1',
        description: '프로젝트 1 설명',
      });
      projectId = res.body.id;
    });
    it('로그인 없이 생성 시도시 401 에러를 반환한다', async () => {
      const res = await request(app).post('/projects').send({ name: '테스트' });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('로그인이 필요합니다');
    });
  });
  describe('프로젝트 조회', () => {
    it('멤버가 프로젝트 조회를 요청하면 성공해야 한다', async () => {
      const res = await request(app)
        .get(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(projectId);
    });

    it('프로젝트 멤버가 아닌 유저가 조회하면 403 에러를 반환한다', async () => {
      const res = await request(app)
        .get(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe('프로젝트 멤버가 아닙니다');
    });

    it('로그인 없이 조회 시도시 401 에러를 반환한다', async () => {
      const res = await request(app).get(`/projects/${projectId}`);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('로그인이 필요합니다');
    });
  });
  describe('프로젝트 수정', () => {
    it('관리자가 프로젝트를 수정하면 성공한다', async () => {
      const res = await request(app)
        .patch(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: '수정된 이름', description: '수정된 설명' });
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('수정된 이름');
    });
    it('로그인 없이 수정을 시도하면 401 에러를 반환한다', async () => {
      const res = await request(app).patch(`/projects/${projectId}`).send({ name: '작성자 아님' });
      expect(res.status).toBe(401);
    });
    it('관리자가 아닌 유저가 수정을 시도하면 403 에러를 반환한다', async () => {
      const res = await request(app)
        .patch(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ name: '작성자 아님' });
      expect(res.status).toBe(403);
    });
  });
  describe('프로젝트 삭제', () => {
    it('관리자가 아닌 유저가 삭제를 시도하면 403 에러를 반환한다', async () => {
      const res = await request(app)
        .delete(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(res.status).toBe(403);
    });

    it('관리자가 삭제 요청시 성공적으로 삭제된다', async () => {
      const res = await request(app)
        .delete(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(204);
      expect(res.body).toEqual({});
    });

    it('삭제된 프로젝트를 다시 조회하면 404 에러를 반환한다', async () => {
      const res = await request(app)
        .get(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });
  });
});
