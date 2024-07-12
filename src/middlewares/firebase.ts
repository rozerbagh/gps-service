const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const fireabseDetails = {
  piKey: "AIzaSyDkYJA21bHxh8RdaVVuojEu9cKdmySAh7g",
  authDomain: "gurukulagamanam.firebaseapp.com",
  projectId: "gurukulagamanam",
  storageBucket: "gurukulagamanam.appspot.com",
  messagingSenderId: "65298135185",
  appId: "1:65298135185:web:a7e4a0d4f736de3858a730",
  measurementId: "G-4K1CYBWJ0B",
  serverKey:
    "AAAADzQSeJE:APA91bF72agyAm0sgkEnTJja81T0LA1r_r7p1FjvBz-UtolJtM1qxt60wz7IUMX3tTd4SxISGaZM-D8QSQ4nXtBfRjLR-K_JcrFNxJ9wgZek8dhNGmfVwXfJ3dNarKY-HwIAqB7VpveU",
};
const serviceAccount = require("./gurukulagamanam-firebase-adminsdk-nefe2-d54afb623b.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function pushNotification(clientDetails: any) {
  let notificationPushed = false;
  try {
    const message = {
      notification: {
        title: "Title of the Notification",
        body: "Body of the Notification",
      },
      token: clientDetails.devicetoken, // FCM token of the device
      // OR
      // topic: 'TOPIC_NAME', // To send to a topic
    };

    await admin
      .messaging()
      .send(message)
      .then((response: any) => {
        // console.log("Notification sent:", response);
        notificationPushed = true;
      })
      .catch((error: any) => {
        // console.log("Error sending notification:", error);
      });
    return;
  } catch (error) {
    notificationPushed = true;
  }
  return notificationPushed;
}

module.exports = { pushNotification };
