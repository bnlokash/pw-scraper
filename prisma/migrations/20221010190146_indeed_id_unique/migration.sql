/*
  Warnings:

  - A unique constraint covering the columns `[indeedId]` on the table `Job` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Job_indeedId_key" ON "Job"("indeedId");
