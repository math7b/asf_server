/*
  Warnings:

  - You are about to drop the column `eventId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_userId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "eventId";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "state" TEXT;

-- DropTable
DROP TABLE "Event";
