import dotenv from "dotenv";

dotenv.config();

export const SMSNotifier = async (url: string, data: string, phoneNumber: string) => {
 
  const countryCode = process.env.SMS_COUNTRY_CODE ? process.env.SMS_COUNTRY_CODE : "+81";

  const smsnotifier = `${url}?phoneNumber=${countryCode}${phoneNumber}`;
  return await fetch(smsnotifier, {
    method: "post",
    headers: {
      "Content-Type": "text/plain",
    },
    body: data,
  });
}
