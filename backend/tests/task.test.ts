import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../src/app';

/**
 * npx vitest run task.test.ts
 */
let accessToken: string;
let projectId: string;
let taskId: string;
describe('할일 통합 테스트', () => {
  beforeAll(async () => {
    await request(app).post('/auth/register').send({
      email: 'testUser@test.com',
      password: 'password123',
      name: '멤버',
    });
    const loginResponse = await request(app).post('/auth/login').send({
      email: 'testUser@test.com',
      password: 'password123',
    });
    expect(loginResponse.status).toBe(200);
    accessToken = loginResponse.body.accessToken;

    const project = await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: '프로젝트 1', // 명세서에 따라 title -> name으로 수정
        description: '프로젝트 1 설명',
      });
    expect(project.status).toBe(200);
    projectId = project.body.id;
  });
  describe('할일 생성', () => {
    it('할일을 성공적으로 생성해야 한다', async () => {
      const newTask = {
        title: '테스트 할일',
        startYear: 2024,
        startMonth: 5,
        startDay: 10,
        endYear: 2024,
        endMonth: 5,
        endDay: 15,
        status: 'todo',
        tags: ['api', 'test'],
        attachments: [],
      };
      const response = await request(app)
        .post(`/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newTask);
      expect(response.status).toBe(200);
      expect(response.body.title).toBe(newTask.title);
      expect(response.body).toHaveProperty('id');
      taskId = response.body.id;
    });
    it('인증 토큰이 없으면 401 에러를 반환해야 한다', async () => {
      const response = await request(app)
        .post(`/projects/${projectId}/tasks`)
        .send({ title: '할일 제목' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('로그인이 필요합니다');
    });
  });
  describe('할일 조회', () => {
    it('할일을 성공적으로 조회해야 한다', async () => {
      const response = await request(app)
        .get(`/projects/${projectId}/tasks`)
        .query({
          page: 1,
          limit: 10,
          status: 'todo',
          order: 'desc',
          order_by: 'created_at',
        })
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body).toHaveProperty('total');
    });
    it('특정 할일의 상세 정보를 성공적으로 반환해야 한다', async () => {
      const response = await request(app)
        .get(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(taskId);
      expect(response.body).toHaveProperty('assignee');
    });
    it('존재하지 않는 할일의 경우 404 에러를 반환해야 한다', async () => {
      const response = await request(app)
        .get(`/tasks/999999`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
    });
  });
  describe('할일 수정', () => {
    it('할일 정보를 수정하고 200 를 반환해야 한다', async () => {
      const updateData = {
        title: '수정된 할일 제목',
        status: 'in_progress',
        assigneeId: 2,
      };

      const response = await request(app)
        .patch(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updateData.title);
      expect(response.body.status).toBe('in_progress');
    });
  });
  describe('할일 삭제', () => {
    it('할일을 삭제하고 204 를 반환해야 한다', async () => {
      const response = await request(app)
        .delete(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(204);
    });
    it('삭제 후 다시 조회하면 404 에러를 반환해야 한다', async () => {
      const response = await request(app)
        .get(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
    });
  });
});
