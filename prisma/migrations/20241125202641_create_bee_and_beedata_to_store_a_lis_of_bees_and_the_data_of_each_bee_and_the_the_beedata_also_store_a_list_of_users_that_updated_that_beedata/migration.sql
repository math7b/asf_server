/*
  Warnings:

  - Made the column `postId` on table `Comment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "postId" SET NOT NULL;

-- CreateTable
CREATE TABLE "Bee" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "beeDataId" TEXT NOT NULL,

    CONSTRAINT "Bee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BeeData" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "BeeData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bee_beeDataId_key" ON "Bee"("beeDataId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bee" ADD CONSTRAINT "Bee_beeDataId_fkey" FOREIGN KEY ("beeDataId") REFERENCES "BeeData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeeData" ADD CONSTRAINT "BeeData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
