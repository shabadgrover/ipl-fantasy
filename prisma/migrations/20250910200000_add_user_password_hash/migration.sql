-- AlterTable
ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT NOT NULL DEFAULT '';

-- Remove temporary default so future inserts must provide a hash
ALTER TABLE "User" ALTER COLUMN "passwordHash" DROP DEFAULT;
