/*
  Warnings:

  - You are about to drop the column `isActive` on the `BeeKeeper` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.
  - Added the required column `iv` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BeeKeeper" DROP COLUMN "isActive";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isActive",
ADD COLUMN     "iv" TEXT NOT NULL;
