import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../src/app';

// npx vitest run member.test.ts

let adminToken: string; // 프로젝트 관리자 토큰
let memberToken: string; // 프로젝트 멤버 토큰
let projectId: string; // 프로젝트 ID
let invitationId: string;
let targetUserId: string; // 제외 테스트를 위한 유저 ID
describe('멤버 통합 테스트', () => {
  beforeAll(async () => {
    // 1. 관리자 회원가입 및 로그인
    await request(app).post('/auth/register').send({
      email: 'admin@example.com',
      password: 'password123',
      name: '관리자',
    });
    const adminLogin = await request(app).post('/auth/login').send({
      email: 'admin@example.com',
      password: 'password123',
    });
    adminToken = adminLogin.body.accessToken;
    // 2. 멤버 회원가입 및 로그인
    await request(app).post('/auth/register').send({
      email: 'member@example.com',
      password: 'password123',
      name: '멤버',
    });

    const memberLogin = await request(app).post('/auth/login').send({
      email: 'member@example.com',
      password: 'password123',
    });
    memberToken = memberLogin.body.accessToken;

    // 3. 유저정보 조회
    const user = await request(app).get('/users/me').set('Authorization', `Bearer ${memberToken}`);
    expect(user.status).toBe(200);
    targetUserId = user.body.id;

    // 4. 테스트용 프로젝트 생성
    const projectRes = await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: '멤버 테스트 프로젝트', description: '설명' });

    projectId = projectRes.body.id;
  });
  describe('멤버 초대', () => {
    it('관리자는 유저를 프로젝트에 초대할 수 있어야 한다', async () => {
      const res = await request(app)
        .post(`/projects/${projectId}/invitations`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ email: 'member@example.com' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('invitationId');
      invitationId = res.body.invitationId;
    });

    it('초대받은 유저는 초대를 수락할 수 있어야 한다', async () => {
      const res = await request(app)
        .post(`/invitations/${invitationId}/accept`)
        .set('Authorization', `Bearer ${memberToken}`);

      expect(res.status).toBe(200);
    });

    it('관리자는 발송된 초대를 삭제할 수 있어야 한다', async () => {
      // 새로운 초대를 생성 후 삭제 테스트
      const invite = await request(app)
        .post(`/projects/${projectId}/invitations`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ email: 'other@example.com' });

      const res = await request(app)
        .delete(`/invitations/${invite.body.invitationId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(204);
    });
  });
  describe('멤버 조회', () => {
    it('프로젝트의 전체 멤버 목록을 조회할 수 있어야 한다', async () => {
      const res = await request(app)
        .get(`/projects/${projectId}/users`)
        .query({ page: 1, limit: 10 })
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body).toHaveProperty('total');
      // 방금 수락한 멤버가 목록에 있는지 확인
      const isMember = res.body.data.some((m: any) => m.id === targetUserId);
      expect(isMember).toBe(true);
    });
  });
  describe('멤버 삭제', () => {
    it('관리자는 멤버를 프로젝트에서 제외할 수 있어야 한다', async () => {
      const res = await request(app)
        .delete(`/projects/${projectId}/users/${targetUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(204);
    });
  });
});
