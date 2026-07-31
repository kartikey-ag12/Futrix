/*
  Warnings:

  - The `metadata` column on the `AdminAuditLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `isDisabled` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isPlatformAdmin` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "AdminAuditLog" DROP COLUMN "metadata",
ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isDisabled",
DROP COLUMN "isPlatformAdmin",
ADD COLUMN     "requiresXeroOnboarding" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "country" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "industry" TEXT;
