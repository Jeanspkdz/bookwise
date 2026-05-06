ALTER TABLE "book" ADD COLUMN "coverColor" varchar(7);--> statement-breakpoint
ALTER TABLE "book" ALTER COLUMN "createdAt" SET DATA TYPE timestamp(4) with time zone USING "createdAt"::timestamp(4) with time zone;--> statement-breakpoint
ALTER TABLE "book" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp(4) with time zone USING "updatedAt"::timestamp(4) with time zone;