/*
  Warnings:

  - A unique constraint covering the columns `[appoinmentId]` on the table `doctor_schedules` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "doctor_schedules_appoinmentId_key" ON "doctor_schedules"("appoinmentId");

-- AddForeignKey
ALTER TABLE "doctor_schedules" ADD CONSTRAINT "doctor_schedules_appoinmentId_fkey" FOREIGN KEY ("appoinmentId") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
