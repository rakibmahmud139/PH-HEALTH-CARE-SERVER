import axios from "axios";
import prisma from "../../../shared/prisma";
import { sslService } from "../ssl/ssl.service";
import config from "../../../config";
import { PaymentStatus } from "@prisma/client";

const initPayment = async (appointmentId: string) => {
  const paymentData = await prisma.payment.findFirstOrThrow({
    where: {
      appointmentId,
    },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });

  const initPaymentData = {
    amount: paymentData.amount,
    transactionId: paymentData.transactionId,
    name: paymentData.appointment.patient.name,
    email: paymentData.appointment.patient.email,
    address: paymentData.appointment.patient.address,
    phoneNumber: paymentData.appointment.patient.contactNumber,
  };

  const result = await sslService.initPayment(initPaymentData);

  return {
    paymentURL: result.GatewayPageURL,
  };
};

const validatePayment = async (payload: any) => {
  // if (!payload || !payload.status || !(payload.status === "VALID")) {
  //   return {
  //     success: "Invalid payment!",
  //   };
  // }

  // const response = await sslService.validatePayment(payload);

  // if (response.status !== "VALID") {
  //   return {
  //     success: "Payment failed!",
  //   };
  // }

  const response = payload;

  await prisma.$transaction(async (tx) => {
    const updatePaymentData = await tx.payment.update({
      where: {
        transactionId: response.tran_id,
      },
      data: {
        status: PaymentStatus.PAID,
        paymentGatewayData: response,
      },
    });

    await tx.appointment.update({
      where: {
        id: updatePaymentData.appointmentId,
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
      },
    });
  });

  return {
    message: "Payment success!",
  };
};

export const paymentService = {
  initPayment,
  validatePayment,
};
