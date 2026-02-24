/*
  Warnings:

  - Added the required column `user_id` to the `SubTask` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubTask" ADD COLUMN     "user_id" BIGINT NOT NULL;

-- CreateIndex
CREATE INDEX "SubTask_task_id_idx" ON "SubTask"("task_id");

-- CreateIndex
CREATE INDEX "SubTask_user_id_idx" ON "SubTask"("user_id");

-- AddForeignKey
ALTER TABLE "SubTask" ADD CONSTRAINT "SubTask_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
