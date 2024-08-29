/*
  Warnings:

  - You are about to drop the column `isAvaible` on the `Book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "isAvaible",
ADD COLUMN     "isAvaiable" BOOLEAN NOT NULL DEFAULT true;
