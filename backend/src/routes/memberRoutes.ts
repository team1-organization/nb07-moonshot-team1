import express from "express";
import * as memberController from "../controllers/memberController";

const router = express.Router();

// 1. 프로젝트 멤버 조회
router.get("/projects/:projectId/users", memberController.getProjectMembers);

// 2. 프로젝트에서 유저 제외하기
router.delete("/projects/:projectId/users/:userId", memberController.removeMember);

// 3. 프로젝트에 멤버 초대
router.post("/projects/:projectId/invitations", memberController.inviteMember);

// 4. 멤버 초대 수락
router.post("/invitations/:invitationId/accept", memberController.acceptInvitation);

// 5. 멤버 초대 삭제
router.delete("/invitations/:invitationId", memberController.cancelInvitation);

export default router;