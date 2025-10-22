-- CreateTable
CREATE TABLE "SectionVersion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "section" TEXT NOT NULL,
    "recordId" INTEGER,
    "data" JSONB NOT NULL,
    "action" TEXT NOT NULL,
    "publishedAt" DATETIME,
    "restoredFromId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    CONSTRAINT "SectionVersion_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SectionVersion_restoredFromId_fkey" FOREIGN KEY ("restoredFromId") REFERENCES "SectionVersion" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "SectionVersion_section_idx" ON "SectionVersion"("section");
