import { prisma } from '../lib/prisma';
import { searchParamsDTO } from '../dtos/common.dto';

export async function getMyProjects({
  userId,
  params,
}: {
  userId: string;
  params: searchParamsDTO;
}) {
  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where: {
        member: {
          some: {
            user_id: BigInt(userId),
          },
        },
      },
      include: {
        member: { select: { id: true } },
        tasks: { select: { status: true } },
      },
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      orderBy: { created_at: 'desc' },
    }),
    prisma.project.count({
      where: {
        member: {
          some: {
            user_id: BigInt(userId),
          },
        },
      },
    }),
  ]);
  return {
    projects,
    total,
  };
}

export async function getProjectById(projectId: string) {
  return prisma.project.findUnique({
    where: {
      id: BigInt(projectId),
    },
    select: {
      id: true,
      title: true,
      description: true,
    },
  });
}

// export async function getMyProjects({
//   userId,
//   params,
// }: {
//   userId: string;
//   params: searchParamsDTO;
// }) {
//   const myId = BigInt(userId);
//
//   // 1. 참여 중인 프로젝트와 대기 중인 초대를 동시에 조회
//   const [projects, pendingInvitations, total] = await Promise.all([
//     // (A) 이미 멤버인 프로젝트
//     prisma.project.findMany({
//       where: {
//         member: { some: { user_id: myId } },
//       },
//       include: {
//         member: { select: { id: true } },
//         tasks: { select: { status: true } },
//       },
//       skip: (params.page - 1) * params.limit,
//       take: params.limit,
//       orderBy: { created_at: 'desc' },
//     }),
//     // (B) 나에게 온 초대 (수락 대기 중)
//     prisma.invitation.findMany({
//       where: {
//         invitee_id: myId,
//         status: 'PENDING',
//         expires_at: { gt: new Date() }, // 만료되지 않은 것만
//       },
//       include: {
//         project: {
//           include: {
//             member: { select: { id: true } },
//             tasks: { select: { status: true } },
//           },
//         },
//       },
//     }),
//     // 전체 개수 (페이지네이션용)
//     prisma.project.count({
//       where: {
//         member: { some: { user_id: myId } },
//       },
//     }),
//   ]);
//
//   // 2. 데이터 가공 (isPending 플래그 추가)
//   const formattedProjects = projects.map((p) => ({
//     ...p,
//     isPending: false, // 이미 멤버임
//   }));
//
//   const formattedInvitations = pendingInvitations.map((inv) => ({
//     ...inv.project,
//     invitationId: inv.id, // 승인 API 호출 시 필요
//     isPending: true, // 아직 초대 상태임
//   }));
//
//   // 3. 초대받은 프로젝트를 목록 앞에 둠 (혹은 기획에 따라 섞음)
//   return {
//     projects: [...formattedInvitations, ...formattedProjects],
//     total: total + formattedInvitations.length,
//   };
// }
