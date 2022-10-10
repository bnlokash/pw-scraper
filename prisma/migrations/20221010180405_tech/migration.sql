/*
  Warnings:

  - You are about to drop the `JobKeyword` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Keyword` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "JobKeyword" DROP CONSTRAINT "JobKeyword_jobId_fkey";

-- DropForeignKey
ALTER TABLE "JobKeyword" DROP CONSTRAINT "JobKeyword_keywordId_fkey";

-- DropTable
DROP TABLE "JobKeyword";

-- DropTable
DROP TABLE "Keyword";

-- CreateTable
CREATE TABLE "Tech" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tech_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobTech" (
    "jobId" INTEGER NOT NULL,
    "techId" INTEGER NOT NULL,

    CONSTRAINT "JobTech_pkey" PRIMARY KEY ("jobId","techId")
);

-- AddForeignKey
ALTER TABLE "JobTech" ADD CONSTRAINT "JobTech_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobTech" ADD CONSTRAINT "JobTech_techId_fkey" FOREIGN KEY ("techId") REFERENCES "Tech"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
