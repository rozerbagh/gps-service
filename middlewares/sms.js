const axios = require("axios");
const { Vonage } = require("@vonage/server-sdk");
const fs = require("fs");
// const accountSid = "YOUR_TWILIO_ACCOUNT_SID";
// const authToken = "YOUR_TWILIO_AUTH_TOKEN";
// const client = require("twilio")(accountSid, authToken);
// const vonage = new Vonage({
//   apiKey: "0af906ec",
//   apiSecret: "O5MpXy9NUlQElMuZ",
// });
const privateKey = fs.readFileSync("middlewares/vonage-private.key", "utf8");
const vonage = new Vonage({
  applicationId: "78404d71-0441-4e21-b3d5-d4ba9ec0ae43",
  privateKey: privateKey,
});

async function sendMessage(text, to_number, from_number) {
  await vonage.messages
    .send({
      text: text,
      message_type: "text",
      to: to_number,
      from: from_number,
      channel: "sms",
    })
    .then((resp) => console.log(resp))
    .catch((err) => console.error(err));
}

async function sendSMS() {
  const from = "Vonage APIs";
  const to = "918050849022";
  const text = "A text message sent using the Vonage SMS API";
  await vonage.sms
    .send({ to, from, text })
    .then((resp) => {
      console.log("Message sent successfully");
      console.log(resp);
    })
    .catch((err) => {
      console.log("There was an error sending the messages.");
      console.error(err);
    });
}

// sendSMS();
// sendMessage(
//   "A text message sent using the Vonage SMS API",
//   "8050849022",
//   "7787995794"
// );

const fromNumber = "YOUR_TWILIO_PHONE_NUMBER"; // Twilio phone number
const toNumber = "RECIPIENT_PHONE_NUMBER"; // Recipient's phone number
const messageBody = "Hello from Node.js!";

// client.messages
//   .create({
//     body: messageBody,
//     from: fromNumber,
//     to: toNumber,
//   })
//   .then((message) => console.log(`Message SID: ${message.sid}`))
//   .catch((err) => console.error(err));

async function sendOtp() {
  const options = {
    method: "POST",
    url: "https://control.msg91.com/api/v5/otp?mobile=918050849022",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authkey: "411338AT617jck65707281P1",
    },
    data: { Param1: "value1", Param2: "value2", Param3: "value3" },
  };

  await axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
}
sendOtp();
