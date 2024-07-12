import nodemailer from "nodemailer";
const { createTransport } = nodemailer;
export const generateOtp = (): number => {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return parseInt(OTP, 10);
};

export async function sendEmail(mailbody: {
  from: string;
  to: string;
  subject: string;
  text: string;
}) {
  return new Promise((resolve, reject) => {
    const transport = createTransport({
      service: "gmail",
      auth: {
        user: "rozerbagh@gmail.com",
        pass: "unbwktwpilhvanyo",
      },
    });

    transport.sendMail(mailbody, (error: any, response: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(response.messageId);
      }
      transport.close();
    });
  });
}
