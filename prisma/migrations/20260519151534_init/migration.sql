-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'FLAGGED');

-- CreateEnum
CREATE TYPE "Decision" AS ENUM ('APPROVED', 'REJECTED', 'FLAGGED');

-- CreateTable
CREATE TABLE "Content" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModerationResult" (
    "id" SERIAL NOT NULL,
    "contentId" INTEGER NOT NULL,
    "violenceScore" DOUBLE PRECISION NOT NULL,
    "hateScore" DOUBLE PRECISION NOT NULL,
    "sexualScore" DOUBLE PRECISION NOT NULL,
    "spamScore" DOUBLE PRECISION NOT NULL,
    "decision" "Decision" NOT NULL,

    CONSTRAINT "ModerationResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ModerationResult_contentId_key" ON "ModerationResult"("contentId");

-- AddForeignKey
ALTER TABLE "ModerationResult" ADD CONSTRAINT "ModerationResult_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
