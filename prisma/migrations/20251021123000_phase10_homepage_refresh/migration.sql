-- AlterTable
ALTER TABLE "Highlight" ADD COLUMN "category" TEXT;
ALTER TABLE "Highlight" ADD COLUMN "tags" TEXT;
ALTER TABLE "Highlight" ADD COLUMN "spotlight" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Transport" ADD COLUMN "badgeText" TEXT;
ALTER TABLE "Transport" ADD COLUMN "nextDeparture" TEXT;
ALTER TABLE "Transport" ADD COLUMN "frequency" TEXT;
ALTER TABLE "Transport" ADD COLUMN "ctaText" TEXT;
ALTER TABLE "Transport" ADD COLUMN "ctaUrl" TEXT;
ALTER TABLE "Transport" ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "StatusMetric" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "unit" TEXT,
    "trendLabel" TEXT,
    "trendValue" TEXT,
    "icon" TEXT,
    "locale" TEXT DEFAULT 'all',
    "override" INTEGER NOT NULL DEFAULT 0,
    "active" INTEGER NOT NULL DEFAULT 1,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "JourneyTile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stage" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "ctaLabel" TEXT,
    "ctaUrl" TEXT,
    "partnerSlug" TEXT,
    "locale" TEXT DEFAULT 'all',
    "active" INTEGER NOT NULL DEFAULT 1,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'INFO',
    "ctaLabel" TEXT,
    "ctaUrl" TEXT,
    "locale" TEXT DEFAULT 'all',
    "dismissible" INTEGER NOT NULL DEFAULT 1,
    "active" INTEGER NOT NULL DEFAULT 1,
    "startAt" DATETIME,
    "endAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
