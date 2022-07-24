-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WaterEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "plantId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    CONSTRAINT "WaterEvent_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WaterEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_WaterEvent" ("createdAt", "id", "plantId", "updatedAt", "userId") SELECT "createdAt", "id", "plantId", "updatedAt", "userId" FROM "WaterEvent";
DROP TABLE "WaterEvent";
ALTER TABLE "new_WaterEvent" RENAME TO "WaterEvent";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
