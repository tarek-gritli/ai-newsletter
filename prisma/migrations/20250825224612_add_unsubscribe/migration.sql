/*
  Warnings:

  - A unique constraint covering the columns `[unsubscribe_token]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - The required column `unsubscribe_token` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "unsubscribe_token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_unsubscribe_token_key" ON "public"."User"("unsubscribe_token");

-- CreateIndex
CREATE INDEX "User_unsubscribe_token_idx" ON "public"."User"("unsubscribe_token");
