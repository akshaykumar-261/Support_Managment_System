
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
//Target direct specifiy method
const { initializeApp } = require('firebase-admin/app');
const { cert } = require('firebase-admin/app');

let initializedAdminApp = null;

export function getFirebaseAdmin() {
    if (initializedAdminApp) return initializedAdminApp;

    if (!process.env.FIREBASE_PROJECT_ID || !process.env.PRIVATE_KEY) {
        console.error("Firebase Environment Variables (.env) miss hain!");
    }

    const privateKey = process.env.PRIVATE_KEY
        ? process.env.PRIVATE_KEY.replace(/\\n/g, "\n")
        : undefined;

    // Direct initialization, bina kisi complex chaining ke
    initializedAdminApp = initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.CLIENT_EMAIL,
            privateKey,
        }),
    });

    return initializedAdminApp;
}