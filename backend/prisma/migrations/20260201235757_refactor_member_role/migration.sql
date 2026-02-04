/*
  Warnings:

  - You are about to drop the column `role` on the `Task` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('OWNER', 'MEMBER');

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "role" "MemberRole" NOT NULL DEFAULT 'MEMBER';

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "role";

-- DropEnum
DROP TYPE "TaskRole";
