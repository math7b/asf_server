/*
  Warnings:

  - You are about to drop the column `content` on the `Bee` table. All the data in the column will be lost.
  - Added the required column `binomialNomenclature` to the `Bee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Bee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bee" DROP COLUMN "content",
ADD COLUMN     "binomialNomenclature" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
