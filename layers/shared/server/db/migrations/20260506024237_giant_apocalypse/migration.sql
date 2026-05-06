ALTER TABLE "book" ALTER COLUMN "coverColor" SET DEFAULT '#FFFFFF';--> statement-breakpoint
UPDATE "book"
SET "coverColor" = '#FFFFFF'
WHERE "coverColor" IS NULL;--> statement-breakpoint
ALTER TABLE "book" ALTER COLUMN "coverColor" SET NOT NULL;