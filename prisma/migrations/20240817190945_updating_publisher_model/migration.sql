/*
  Warnings:

  - Added the required column `image` to the `Publisher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Publisher" ADD COLUMN     "deletedYear" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "image" TEXT NOT NULL;
