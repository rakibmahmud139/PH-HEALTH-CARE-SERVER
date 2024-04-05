-- CreateEnum
CREATE TYPE "BloodGroup" AS ENUM ('A_POSITIVE', 'B_POSITIVE', 'AB_POSITIVE', 'O_POSITIVE', 'A_NEGATIVE', 'B_NEGATIVE', 'AB_NEGATIVE', 'O_NEGATIVE');

-- CreateEnum
CREATE TYPE "MeritalStatus" AS ENUM ('MARRIED', 'UNMARRIED');

-- CreateTable
CREATE TABLE "patient_health_datas" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "bloodGroup" "BloodGroup" NOT NULL,
    "hasAllergies" BOOLEAN NOT NULL,
    "hasDiabetes" BOOLEAN NOT NULL,
    "height" TEXT NOT NULL,
    "width" TEXT NOT NULL,
    "smokingStatus" BOOLEAN NOT NULL,
    "dietaryPreferences" BOOLEAN NOT NULL,
    "pregnancyStatus" BOOLEAN NOT NULL,
    "mentalHealthStatus" TEXT NOT NULL,
    "immunizationStatus" TEXT NOT NULL,
    "hasPastSugeries" BOOLEAN NOT NULL,
    "recentAnxiety" BOOLEAN NOT NULL,
    "recentDepression" BOOLEAN NOT NULL,
    "meritalStatus" "MeritalStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_health_datas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_reports" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "reportName" TEXT NOT NULL,
    "reportLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patient_health_datas_patientId_key" ON "patient_health_datas"("patientId");

-- AddForeignKey
ALTER TABLE "patient_health_datas" ADD CONSTRAINT "patient_health_datas_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_reports" ADD CONSTRAINT "medical_reports_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
