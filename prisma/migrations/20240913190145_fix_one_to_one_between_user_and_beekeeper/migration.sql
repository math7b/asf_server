/*
  Warnings:

  - Made the column `userId` on table `BeeKeeper` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "BeeKeeper" DROP CONSTRAINT "BeeKeeper_userId_fkey";

-- AlterTable
ALTER TABLE "BeeKeeper" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "BeeKeeper" ADD CONSTRAINT "BeeKeeper_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
