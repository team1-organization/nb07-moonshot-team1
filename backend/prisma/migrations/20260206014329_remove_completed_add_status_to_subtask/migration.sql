/*
  Warnings:

  - You are about to drop the column `completed` on the `SubTask` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SubTask" DROP COLUMN "completed",
ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'TODO';
