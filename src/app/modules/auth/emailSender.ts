import nodemailer from "nodemailer";
import config from "../../../config";

export const emailSender = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: config.email_sender.email,
      pass: config.email_sender.app_pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: '"PH HEALTH CARE 👻" <hasansaikat74@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Password Reset link✔", // Subject line
    //text: "Hello world?", // plain text body
    html, // html body
  });

  console.log("Message sent: %s", info.messageId);
};
