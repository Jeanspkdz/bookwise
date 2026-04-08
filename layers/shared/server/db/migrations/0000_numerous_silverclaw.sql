CREATE TABLE "book" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"summary" text NOT NULL,
	"author" text NOT NULL,
	"category" text NOT NULL,
	"rating" real DEFAULT 0 NOT NULL,
	"totalBooks" integer DEFAULT 0 NOT NULL,
	"availableBooks" integer DEFAULT 0 NOT NULL,
	"imageUrl" text NOT NULL,
	"videoUrl" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
