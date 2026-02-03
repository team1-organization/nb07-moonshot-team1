import { MemberStatus, ProviderEnum, TaskRole, TaskStatus } from '../generated/prisma';
import { prisma } from '../src/lib/prisma';

async function main(): Promise<void> {
  console.log('시딩 시작...');

  // 기존 데이터 삭제
  await prisma.taskTag.deleteMany();
  await prisma.tag.deleteMany();

  await prisma.subTask.deleteMany();
  await prisma.taskImage.deleteMany();
  await prisma.comment.deleteMany();

  await prisma.task.deleteMany();
  await prisma.member.deleteMany();

  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  console.log('️기존 데이터 초기화 완료');

  // 유저 생성
  const [owner, member, outsider] = await Promise.all([
    prisma.user.create({
      data: {
        email: 'owner@test.com',
        name: '김방장',
        password: 'hashed_password_here',
        provider: ProviderEnum.LOCAL,
      },
    }),
    prisma.user.create({
      data: {
        email: 'member@test.com',
        name: '이멤버',
        provider: ProviderEnum.LOCAL,
      },
    }),
    prisma.user.create({
      data: {
        email: 'outsider@test.com',
        name: '외부인',
        provider: ProviderEnum.LOCAL,
      },
    }),
  ]);

  // 프로젝트 생성
  const project = await prisma.project.create({
    data: {
      user_id: owner.id,
      title: 'Moonshot 협업 플랫폼',
      description: 'Prisma와 TS를 활용한 차세대 협업 툴',
    },
  });

  // 프로젝트 멤버 구성 (JOINED만 접근 허용)
  await prisma.member.createMany({
    data: [
      { project_id: project.id, user_id: owner.id, status: MemberStatus.JOINED },
      { project_id: project.id, user_id: member.id, status: MemberStatus.JOINED },
    ],
  });

  // 태그 생성
  const [tagUrgent, tagPlan, tagBug] = await Promise.all([
    prisma.tag.create({ data: { name: '긴급' } }),
    prisma.tag.create({ data: { name: '기획' } }),
    prisma.tag.create({ data: { name: '버그' } }),
  ]);

  const now = Date.now();
  const dateValue = (daysFromNow: number) => new Date(now + 1000 * 60 * 60 * 24 * daysFromNow);

  // 할 일 생성
  const task1 = await prisma.task.create({
    data: {
      project_id: project.id,
      user_id: owner.id, // 담당자
      title: '초기 API 명세서 작성',
      content: 'API 명세서를 작성합니다.',
      status: TaskStatus.TODO,
      role: TaskRole.OWNER,
      start_date: dateValue(0),
      end_date: dateValue(3), // 3일 후 (기한임박순 테스트)

      subTasks: {
        create: [
          { content: 'Auth API 설계', completed: true },
          { content: 'Project API 설계', completed: false },
        ],
      },

      tags: {
        create: [
          { tag_id: tagPlan.id }, // 기획
          { tag_id: tagUrgent.id }, // 긴급
        ],
      },
    },
    select: { id: true },
  });

  const task2 = await prisma.task.create({
    data: {
      project_id: project.id,
      user_id: member.id,
      title: '로그인 버그 수정',
      content: '소셜 로그인 콜백 처리에서 에러 발생.',
      status: TaskStatus.IN_PROGRESS,
      role: TaskRole.MEMBER,
      start_date: dateValue(-1),
      end_date: dateValue(1), //(기한임박순 테스트)

      tags: {
        create: [{ tag_id: tagBug.id }],
      },

      taskImages: {
        create: [
          { url: 'https://example.com/image1.png', order: 0 },
          { url: 'https://example.com/image2.png', order: 1 },
        ],
      },
    },
    select: { id: true },
  });

  const task3 = await prisma.task.create({
    data: {
      project_id: project.id,
      user_id: owner.id,
      title: 'Charlie - 문서 정리',
      content: 'README / API 문서 / ERD 정리',
      status: TaskStatus.DONE,
      role: TaskRole.OWNER,
      start_date: dateValue(-7),
      end_date: dateValue(10),

      tags: {
        create: [{ tag_id: tagPlan.id }],
      },
    },
    select: { id: true },
  });

  // 댓글 생성
  await prisma.comment.createMany({
    data: [
      {
        user_id: owner.id,
        task_id: task2.id,
        content: '재현 절차랑 에러 로그 남겨줘.',
      },
      {
        user_id: member.id,
        task_id: task2.id,
        content: '로그 확인했고 callback URL 파라미터 쪽 수정 중.',
      },
    ],
  });

  // 추가 태그 연결
  await prisma.taskTag.create({
    data: {
      task_id: task3.id,
      tag_id: tagUrgent.id,
    },
  });

  console.log('시딩 완료');
  console.log({
    ownerId: owner.id.toString(),
    memberId: member.id.toString(),
    outsiderId: outsider.id.toString(),
    projectId: project.id.toString(),
    taskIds: [task1.id, task2.id, task3.id].map((x) => x.toString()),
  });
}

main()
  .catch((error: Error) => {
    console.error('시딩 중 에러 발생');
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
