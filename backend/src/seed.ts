import { MemberRole, ProviderEnum, TaskStatus } from '../generated/prisma'; // output 경로 확인 필요
import { prisma } from '../src/lib/prisma';

async function main(): Promise<void> {
  console.log('🚀 시딩 시작...');

  // 1. 기존 데이터 삭제 (삭제 순서 주의: 자식 -> 부모)
  await prisma.taskTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.subTask.deleteMany();
  await prisma.taskImage.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.member.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 기존 데이터 초기화 완료');

  // 2. 유저 생성
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

  // 3. 프로젝트 생성
  const project = await prisma.project.create({
    data: {
      user_id: owner.id,
      title: 'Moonshot 협업 플랫폼',
      description: 'Prisma와 TS를 활용한 차세대 협업 툴',
    },
  });

  // 4. 프로젝트 멤버 구성 (MemberRole 사용)
  await prisma.member.createMany({
    data: [
      {
        project_id: project.id,
        user_id: owner.id,
        role: MemberRole.OWNER,
      },
      {
        project_id: project.id,
        user_id: member.id,
        role: MemberRole.MEMBER,
      },
    ],
  });

  // 5. 태그 생성
  const [tagUrgent, tagPlan, tagBug] = await Promise.all([
    prisma.tag.create({ data: { name: '긴급' } }),
    prisma.tag.create({ data: { name: '기획' } }),
    prisma.tag.create({ data: { name: '버그' } }),
  ]);

  const dateValue = (daysFromNow: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d;
  };

  // 6. 할 일 생성 (Task 모델에는 role 필드가 없으므로 제외)
  const task1 = await prisma.task.create({
    data: {
      project_id: project.id,
      user_id: owner.id, // 담당자
      title: '초기 API 명세서 작성',
      content: 'API 명세서를 작성합니다.',
      status: TaskStatus.TODO,
      start_date: dateValue(0),
      end_date: dateValue(3),

      subTasks: {
        create: [
          { content: 'Auth API 설계', user_id: owner.id },
          { content: 'Project API 설계', user_id: owner.id },
        ],
      },

      tags: {
        create: [{ tag_id: tagPlan.id }, { tag_id: tagUrgent.id }],
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
      start_date: dateValue(-1),
      end_date: dateValue(1),

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
      title: '문서 정리',
      content: 'README / API 문서 / ERD 정리',
      status: TaskStatus.DONE,
      start_date: dateValue(-7),
      end_date: dateValue(10),

      tags: {
        create: [{ tag_id: tagPlan.id }],
      },
    },
    select: { id: true },
  });

  // 7. 댓글 생성
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

  console.log('✅ 시딩 완료');
  console.log({
    ownerId: owner.id.toString(),
    memberId: member.id.toString(),
    projectId: project.id.toString(),
  });
}

main()
  .catch((error: Error) => {
    console.error('❌ 시딩 중 에러 발생');
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
