-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "indeedId" TEXT NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Keyword" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Keyword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobKeyword" (
    "jobId" INTEGER NOT NULL,
    "keywordId" INTEGER NOT NULL,

    CONSTRAINT "JobKeyword_pkey" PRIMARY KEY ("jobId","keywordId")
);

-- AddForeignKey
ALTER TABLE "JobKeyword" ADD CONSTRAINT "JobKeyword_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobKeyword" ADD CONSTRAINT "JobKeyword_keywordId_fkey" FOREIGN KEY ("keywordId") REFERENCES "Keyword"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
