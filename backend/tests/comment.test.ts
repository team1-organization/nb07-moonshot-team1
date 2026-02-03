import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../src/app';

// npx vitest run comment.test.ts

let accessToken: string;
let otherUserToken: string;
let projectId: string;
let taskId: string;
let commentId: string;
describe('답글 통합 테스트', () => {
  beforeAll(async () => {
    await request(app)
      .post('/auth/register')
      .send({ email: 'owner@test.com', password: 'password123', name: '작성자' });
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: 'owner@test.com', password: 'password123' });
    accessToken = loginRes.body.accessToken;

    await request(app)
      .post('/auth/register')
      .send({ email: 'other@test.com', password: 'password123', name: '멤버' });
    const otherLoginRes = await request(app)
      .post('/auth/login')
      .send({ email: 'other@test.com', password: 'password123' });
    otherUserToken = otherLoginRes.body.accessToken;

    // 2. 프로젝트 사전 생성
    const projectRes = await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: '댓글 테스트 프로젝트', description: '설명' });
    projectId = projectRes.body.id;

    // 3. 할일 사전 생성
    const taskRes = await request(app)
      .post(`/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: '댓글용 할일',
        startYear: 2026,
        startMonth: 1,
        startDay: 30,
        endYear: 2026,
        endMonth: 2,
        endDay: 1,
        status: 'todo',
        tags: ['태그1', '태그2'],
        attachments: [],
      });
    taskId = taskRes.body.id;
  });
  describe('답글 생성', () => {
    it('할일에 새로운 답글을 추가할 수 있어야 한다', async () => {
      const res = await request(app)
        .post(`/tasks/${taskId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: '테스트 댓글입니다.' });

      expect(res.status).toBe(200);
      expect(res.body.content).toBe('테스트 댓글입니다.');
      expect(res.body.taskId).toBe(taskId);
      commentId = res.body.id;
    });
  });
  describe('답글 조회', () => {
    it('할일에 달린 모든 답글 목록을 조회할 수 있어야 한다', async () => {
      const res = await request(app)
        .get(`/tasks/${taskId}/comments`)
        .query({ page: 1, limit: 10 })
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
    it('특정 답글을 ID로 상세 조회할 수 있어야 한다', async () => {
      const res = await request(app)
        .get(`/comments/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(commentId);
      expect(res.body.content).toBeDefined();
    });
  });
  describe('답글 수정', () => {
    it('작성자 본인은 답글을 수정할 수 있어야 한다', async () => {
      const res = await request(app)
        .patch(`/comments/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: '수정된 댓글 내용입니다.' });

      expect(res.status).toBe(200);
      expect(res.body.content).toBe('수정된 댓글 내용입니다.');
    });
    it('작성자가 아닌 유저가 수정 시도 시 403을 반환해야 한다', async () => {
      const res = await request(app)
        .patch(`/comments/${commentId}`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .send({ content: '테스트 답글' });

      expect(res.status).toBe(403);
    });
  });
  describe('답글 삭제', () => {
    it('작성자가 아닌 유저가 삭제 시도 시 403을 반환해야 한다', async () => {
      const res = await request(app)
        .delete(`/comments/${commentId}`)
        .set('Authorization', `Bearer ${otherUserToken}`);

      expect(res.status).toBe(403);
    });
    it('작성자 본인은 답글을 삭제할 수 있어야 한다', async () => {
      const res = await request(app)
        .delete(`/comments/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(204);
    });

    it('삭제된 답글 조회 시 404를 반환해야 한다', async () => {
      const res = await request(app)
        .get(`/comments/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(404);
    });
  });
});
