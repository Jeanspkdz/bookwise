CREATE TYPE "account-status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "is_approved" TO "status";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "status" SET DATA TYPE "account-status" USING (CASE WHEN "status" THEN 'approved' ELSE 'pending' END)::"account-status";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "status" SET DEFAULT 'pending'::"account-status";
