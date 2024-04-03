import prisma from "../../../shared/prisma";

const updateIntoDB = async (id: string, payload: any) => {
  const { specialties, ...doctorData } = payload;

  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await prisma.$transaction(async (transactionClient) => {
    const updatedData = await transactionClient.doctor.update({
      where: {
        id,
      },
      data: doctorData,
      include: {
        doctorSpecialties: true,
      },
    });

    if (specialties && specialties.length > 0) {
      //delete specialties

      const deleteSpecialtiesIds = specialties.filter(
        (specialty) => specialty.isDeleted
      );

      for (const specialty of deleteSpecialtiesIds) {
        await transactionClient.doctorSpecialties.deleteMany({
          where: {
            doctorId: doctorInfo.id,
            specialtiesId: specialty.specialtiesId,
          },
        });
      }

      //create specialties

      const createSpecialtiesIds = specialties.filter(
        (specialty) => !specialty.isDeleted
      );

      for (const specialty of createSpecialtiesIds) {
        await transactionClient.doctorSpecialties.create({
          data: {
            doctorId: doctorInfo.id,
            specialtiesId: specialty.specialtiesId,
          },
        });
      }
    }
  });

  const result = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: doctorInfo.id,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  return result;
};

export const doctorServices = {
  updateIntoDB,
};
