/*
  Warnings:

  - You are about to drop the column `state` on the `BeeKeeper` table. All the data in the column will be lost.
  - Added the required column `state` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BeeKeeper" DROP COLUMN "state";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "state" TEXT NOT NULL;
