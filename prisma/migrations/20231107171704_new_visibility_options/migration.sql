/*
  Warnings:

  - You are about to drop the column `visibility` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Community" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "visibility";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "joinedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropEnum
DROP TYPE "ContentVisibility";
