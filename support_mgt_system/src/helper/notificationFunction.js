import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { getMessaging } = require('firebase-admin/messaging');
import { getFirebaseAdmin } from "./fireBaseAdmin.js";

export const sendPushNotification = async (deviceToken, title, body, extraData = {}) => {
  try {
    const firebaseApp = getFirebaseAdmin();
    const messagingInstance = getMessaging(firebaseApp);

    const message = {
      token: deviceToken,
      notification: { title, body },
      data: extraData,
    };

    // 2. Send Request
    const response = await messagingInstance.send(message);
    console.log("Firebase Notification Sent Successfully:", response);
    return response;

  } catch (error) {
    if (error.code === 'messaging/invalid-argument' || error.code === 'messaging/registration-token-not-registered') {
        console.warn(`Warning: Token [${deviceToken}] Invalid or Not Found In Db`);
    } else {
        console.error(" Error sending push notification:", error);
    }
    return null;
  }
};