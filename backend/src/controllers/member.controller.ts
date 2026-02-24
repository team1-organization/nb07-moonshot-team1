import { Request, Response } from 'express';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { commonIdParam, listParams, searchParamsDTO } from '../dtos/common.dto';
import * as memberService from '../services/member.service';

export async function getProjectMembers(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('로그인이 필요합니다');
  const { projectId, userId } = commonIdParam
    .pick({ projectId: true, userId: true })
    .required()
    .parse({
      projectId: req.params.projectId,
      userId: req.user.id,
    });
  const params: searchParamsDTO = listParams.parse(req.query);
  const members = await memberService.getProjectMembers({
    projectId,
    userId,
    data: params,
  });
  res.status(200).json(members);
}

export async function removeProjectMember(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('로그인이 필요합니다');
  const { projectId, inviterId, inviteeId } = commonIdParam
    .pick({ projectId: true, inviterId: true, inviteeId: true })
    .required()
    .parse({
      projectId: req.params.projectId,
      inviterId: req.user.id,
      inviteeId: req.params.userId,
    });
  await memberService.removeProjectMember(projectId, inviterId, inviteeId);
  res.status(204).json();
}

export async function inviteUserToProject(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('로그인이 필요합니다');
  const { projectId, userId: inviterId } = commonIdParam
    .pick({ projectId: true, userId: true })
    .required()
    .parse({
      projectId: req.params.projectId,
      userId: req.user.id,
    });
  const { email } = req.body;
  const member = await memberService.inviteUserToProject(projectId, inviterId, email);
  res.status(200).json(member);
}

export async function acceptInvitation(req: Request, res: Response) {
  const { invitationId, projectId, inviteeId } = commonIdParam
    .pick({ invitationId: true, projectId: true, inviteeId: true })
    .required()
    .parse({
      invitationId: req.params.invitationId,
      projectId: req.query.projectId,
      inviteeId: req.query.inviteeId,
    });
  const member = await memberService.acceptInvitation(invitationId, projectId, inviteeId);
  res.status(200).json('초대 수락 완료');
}

export async function cancelInvitation(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError('로그인이 필요합니다');
  const { invitationId, userId } = commonIdParam
    .pick({ invitationId: true, userId: true })
    .required()
    .parse({
      invitationId: req.params.invitationId,
      userId: req.user.id,
    });
  await memberService.cancelInvitation(invitationId, userId);
  res.status(204).json();
}
