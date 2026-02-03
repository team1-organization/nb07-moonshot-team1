import { beforeAll, describe } from 'vitest';
import request from 'supertest';
import app from '../src/app';

// npx vitest run subTask.test.ts

let accessToken: string;
let projectId: string;
let parentTaskId: string;
let subtaskId: string;
describe('서브 할일 통합 테스트', () => {
  beforeAll(async () => {
    // 1. 회원가입
    await request(app).post('/auth/register').send({
      email: 'subtask@test.com',
      password: 'password123',
      name: '테스트',
    });
    // 2. 로그인
    const res = await request(app).post('/auth/login').send({
      email: 'subtask@test.com',
      password: 'password123',
    });
    accessToken = res.body.accessToken;

    // 3. 부모 프로젝트 생성
    const projectRes = await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: '하위 할일 테스트 프로젝트', description: '설명' });
    projectId = projectRes.body.id;

    // 4. 할일 생성4
    const taskRes = await request(app)
      .post(`/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: '할일',
        startYear: 2026,
        startMonth: 1,
        startDay: 30,
        endYear: 2026,
        endMonth: 2,
        endDay: 1,
        status: 'todo',
        tags: ['태그55', '태그222'],
        attachments: [],
      });
    parentTaskId = taskRes.body.id;
  });
  describe('서브 할일 생성', () => {});
});
