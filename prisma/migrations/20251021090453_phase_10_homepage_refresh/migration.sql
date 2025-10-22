/*
  Warnings:

  - You are about to alter the column `active` on the `Alert` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.
  - You are about to alter the column `dismissible` on the `Alert` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.
  - You are about to alter the column `spotlight` on the `Highlight` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.
  - You are about to alter the column `active` on the `JourneyTile` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.
  - You are about to alter the column `active` on the `StatusMetric` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.
  - You are about to alter the column `override` on the `StatusMetric` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Alert" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'INFO',
    "ctaLabel" TEXT,
    "ctaUrl" TEXT,
    "locale" TEXT DEFAULT 'all',
    "dismissible" BOOLEAN NOT NULL DEFAULT true,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "startAt" DATETIME,
    "endAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Alert" ("active", "createdAt", "ctaLabel", "ctaUrl", "dismissible", "endAt", "id", "locale", "message", "severity", "startAt", "title") SELECT "active", "createdAt", "ctaLabel", "ctaUrl", "dismissible", "endAt", "id", "locale", "message", "severity", "startAt", "title" FROM "Alert";
DROP TABLE "Alert";
ALTER TABLE "new_Alert" RENAME TO "Alert";
CREATE TABLE "new_Highlight" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "category" TEXT,
    "tags" TEXT,
    "spotlight" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Highlight" ("category", "description", "id", "imageUrl", "spotlight", "tags", "title") SELECT "category", "description", "id", "imageUrl", "spotlight", "tags", "title" FROM "Highlight";
DROP TABLE "Highlight";
ALTER TABLE "new_Highlight" RENAME TO "Highlight";
CREATE TABLE "new_JourneyTile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stage" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "ctaLabel" TEXT,
    "ctaUrl" TEXT,
    "partnerSlug" TEXT,
    "locale" TEXT DEFAULT 'all',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_JourneyTile" ("active", "ctaLabel", "ctaUrl", "description", "icon", "id", "locale", "partnerSlug", "sortOrder", "stage", "title") SELECT "active", "ctaLabel", "ctaUrl", "description", "icon", "id", "locale", "partnerSlug", "sortOrder", "stage", "title" FROM "JourneyTile";
DROP TABLE "JourneyTile";
ALTER TABLE "new_JourneyTile" RENAME TO "JourneyTile";
CREATE TABLE "new_StatusMetric" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "unit" TEXT,
    "trendLabel" TEXT,
    "trendValue" TEXT,
    "icon" TEXT,
    "locale" TEXT DEFAULT 'all',
    "override" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_StatusMetric" ("active", "icon", "id", "locale", "metric", "override", "sortOrder", "title", "trendLabel", "trendValue", "type", "unit", "updatedAt") SELECT "active", "icon", "id", "locale", "metric", "override", "sortOrder", "title", "trendLabel", "trendValue", "type", "unit", "updatedAt" FROM "StatusMetric";
DROP TABLE "StatusMetric";
ALTER TABLE "new_StatusMetric" RENAME TO "StatusMetric";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
