/*
  Warnings:

  - A unique constraint covering the columns `[imageId]` on the table `Suggestion` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Suggestion" DROP CONSTRAINT "Suggestion_imageId_fkey";

-- AlterTable
ALTER TABLE "Suggestion" ALTER COLUMN "imageId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Suggestion_imageId_key" ON "Suggestion"("imageId");

-- AddForeignKey
ALTER TABLE "Suggestion" ADD CONSTRAINT "Suggestion_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
