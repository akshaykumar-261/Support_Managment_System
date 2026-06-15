
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { initializeApp } = require('firebase-admin/app');
const { cert } = require('firebase-admin/app');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let initializedAdminApp = null;
export function getFirebaseAdmin() {
  if (initializedAdminApp) return initializedAdminApp;
  const jsonPath = path.join(__dirname, "../../demoticket-3c41a-firebase-adminsdk-fbsvc-24e42261cc.json");
  const serviceAccount = JSON.parse(
    fs.readFileSync(jsonPath, "utf8")
  );
  initializedAdminApp = initializeApp({
    credential: cert(serviceAccount),
  });
  return initializedAdminApp;
}