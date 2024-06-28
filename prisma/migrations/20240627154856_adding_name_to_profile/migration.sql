-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "name" TEXT,
ALTER COLUMN "username" DROP NOT NULL;
