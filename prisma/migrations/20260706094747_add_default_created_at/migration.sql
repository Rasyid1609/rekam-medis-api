-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MedicalRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patientId" INTEGER NOT NULL,
    "keluhan" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "tindakan" TEXT,
    "dokter" TEXT NOT NULL,
    "tanggal" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MedicalRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MedicalRecord" ("createdAt", "diagnosis", "dokter", "id", "keluhan", "patientId", "tanggal", "tindakan") SELECT "createdAt", "diagnosis", "dokter", "id", "keluhan", "patientId", "tanggal", "tindakan" FROM "MedicalRecord";
DROP TABLE "MedicalRecord";
ALTER TABLE "new_MedicalRecord" RENAME TO "MedicalRecord";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
