import { searchParamsDTO } from '../dtos/common.dto';
import * as memberRepository from '../repositories/member.repository';
import * as userRepository from '../repositories/user.repository';
import { ForbiddenError } from '../errors/ForbiddenError';
import { NotFoundError } from '../errors/NotFoundError';
import { Member } from '../types/member.type';
import { safeString } from '../utils/string.util';

export async function getProjectMembers({
  projectId,
  userId,
  data,
}: {
  projectId: string;
  userId: string;
  data: searchParamsDTO;
}) {
  const findMember = await memberRepository.isMemberByProjectId(projectId, userId);
  if (!findMember) throw new ForbiddenError('프로젝트 멤버가 아닙니다');
  const { members, total } = await memberRepository.getProjectMembers({
    projectId,
    userId,
    data,
  });
  return {
    data: Member.fromEntityList(members),
    total,
  };
}
export async function removeProjectMember(projectId: string, inviterId: string, inviteeId: string) {
  const isAdmin = await memberRepository.isAdmin({ projectId, userId: inviterId });
  if (!isAdmin) throw new ForbiddenError('프로젝트 관리자가 아닙니다');
  return await memberRepository.removeMember(projectId, inviteeId);
}
export async function inviteUserToProject(projectId: string, inviterId: string, email: string) {
  const isAdmin = await memberRepository.isAdmin({ projectId, userId: inviterId });
  if (!isAdmin) throw new ForbiddenError('프로젝트 관리자가 아닙니다');

  const invitee = await userRepository.getMyProfileByEmail(email);
  if (!invitee) {
    throw new NotFoundError('초대하려는 사용자가 존재하지 않습니다');
  }
  const isAlreadyMember = await memberRepository.isMemberByProjectId(
    projectId,
    safeString(invitee.id),
  );
  if (isAlreadyMember) throw new Error('이미 프로젝트의 멤버입니다');
  return await memberRepository.inviteMember(projectId, inviterId, email);
}

export async function acceptInvitation(invitationId: string, userId: string) {
  const invitation = await memberRepository.getInvitationById(invitationId);
  if (!invitation) throw new NotFoundError('존재하지 않는 초대입니다');
  if (safeString(invitation.invitee_id) !== userId)
    throw new ForbiddenError('본인에게 온 초대만 수락할 수 있습니다');
  return await memberRepository.acceptInvitation({
    invitationId,
    projectId: safeString(invitation.project_id),
    userId,
  });
}
export async function cancelInvitation(invitationId: string, inviterId: string) {
  const invitation = await memberRepository.getInvitationById(invitationId);
  if (!invitation) throw new NotFoundError('존재하지 않는 초대입니다');

  const isAdmin = await memberRepository.isAdmin({
    projectId: safeString(invitation.project.id),
    userId: inviterId,
  });

  if (!isAdmin) throw new ForbiddenError('권한이 없습니다');

  return await memberRepository.cancelInvitation(invitationId);
}
