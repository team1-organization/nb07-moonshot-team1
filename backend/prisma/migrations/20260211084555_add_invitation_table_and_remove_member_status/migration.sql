/*
  Warnings:

  - You are about to drop the column `status` on the `Member` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- DropIndex
DROP INDEX "Member_status_idx";

-- DropIndex
DROP INDEX "Task_project_id_created_at_idx";

-- DropIndex
DROP INDEX "Task_project_id_end_date_idx";

-- DropIndex
DROP INDEX "Task_project_id_idx";

-- DropIndex
DROP INDEX "Task_project_id_status_idx";

-- DropIndex
DROP INDEX "Task_project_id_user_id_idx";

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "status";

-- DropEnum
DROP TYPE "MemberStatus";

-- CreateTable
CREATE TABLE "Invitation" (
    "id" BIGSERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "project_id" BIGINT NOT NULL,
    "inviter_id" BIGINT NOT NULL,
    "invitee_id" BIGINT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_token_key" ON "Invitation"("token");

-- CreateIndex
CREATE INDEX "Invitation_status_expires_at_idx" ON "Invitation"("status", "expires_at");

-- CreateIndex
CREATE INDEX "Invitation_project_id_status_idx" ON "Invitation"("project_id", "status");

-- CreateIndex
CREATE INDEX "Invitation_invitee_id_status_idx" ON "Invitation"("invitee_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_project_id_invitee_id_key" ON "Invitation"("project_id", "invitee_id");

-- CreateIndex
CREATE INDEX "Project_user_id_idx" ON "Project"("user_id");

-- CreateIndex
CREATE INDEX "Task_project_id_status_end_date_idx" ON "Task"("project_id", "status", "end_date");

-- CreateIndex
CREATE INDEX "Task_project_id_user_id_end_date_idx" ON "Task"("project_id", "user_id", "end_date");

-- CreateIndex
CREATE INDEX "Task_project_id_created_at_idx" ON "Task"("project_id", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_inviter_id_fkey" FOREIGN KEY ("inviter_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_invitee_id_fkey" FOREIGN KEY ("invitee_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
