-- AlterTable
ALTER TABLE "User" ADD COLUMN     "google_access_token" TEXT,
ADD COLUMN     "google_refresh_token" TEXT,
ADD COLUMN     "google_token_expires" TIMESTAMP(3);
