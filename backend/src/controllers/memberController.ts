import { Request, Response } from "express";
import { MemberStatus, PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

// [GET] 프로젝트 멤버 조회
export const getProjectMembers = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.params;
  try {
    const members = await prisma.member.findMany({
      where: { project_id: Number(projectId) },
      include: { user: true } 
    });
    res.status(200).json({ data: members });
  } catch (error) {
    res.status(500).json({ message: "멤버 조회 실패", error });
  }
};

// [POST] 프로젝트에 멤버 초대
export const inviteMember = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.params;
  const { userId } = req.body;
  try {
    const invitation = await prisma.member.create({
      data: {
       project_id: Number(projectId),
        user_id: Number(userId),
      }
    });
    res.status(201).json({ message: "초대 성공", data: invitation });
  } catch (error) {
    res.status(500).json({ message: "초대 실패", error });
  }
};

// [DELETE] 프로젝트에서 유저 제외하기
export const removeMember = async (req: Request, res: Response): Promise<void> => {
  const { projectId, userId } = req.params;
  try {
    await prisma.member.deleteMany({
      where: {
        project_id: Number(projectId),
        user_id: Number(userId)
      }
    });
    res.status(200).json({ message: "멤버 제외 완료" });
  } catch (error) {
    res.status(500).json({ message: "멤버 제외 실패", error });
  }
};

// [POST] 멤버 초대 수락
export const acceptInvitation = async (req: Request, res: Response): Promise<void> => {
  const { invitationId } = req.params;

  try {
    const updatedMember = await prisma.member.update({
      where: { id: BigInt(invitationId as string) },
      data: {
        status: 'INVITED'
      },
    });
    res.status(200).json({
      message: "초대를 수락했습니다.",
      data: JSON.parse(JSON.stringify(updatedMember, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      ))
    });
  } catch (error) {
    res.status(500).json({ message: "초대 수락 실패", error });
  }
};

// [DELETE] 멤버 초대 삭제 (초대 취소)
export const cancelInvitation = async (req: Request, res: Response): Promise<void> => {
  const { invitationId } = req.params;

  try {
    await prisma.member.delete({
      where: { id: BigInt(invitationId as string) }
    });

    res.status(200).json({ message: "초대가 삭제되었습니다." });
  } catch (error) {
    res.status(500).json({ message: "초대 삭제 실패", error });
  }
};