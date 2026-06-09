import admin from "firebase-admin";

let app = null;
export function getFirebaseAdmin() {
    if (app) return app;
    app = admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.CLIENT_EMAIL,
            privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
        })
    })
    return admin;
}