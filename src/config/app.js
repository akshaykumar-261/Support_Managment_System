import mongoose from "mongoose";
import { serverFile } from "../utility/helper/commanMessage.js";
const startServer = async (app, PORT) => {
const envPort = PORT || process.env.PORT || 5000;
const envDB_URL = process.env.DB_URL;
// Check DB URL
  if (!envDB_URL) {
    console.error(`${serverFile.MISSING_URL}`);
    process.exit(1);
  }
  // Check Node Version
  const majorVersion = process.versions.node.split(".")[0];
  if (majorVersion < 20) {
    console.error(`${serverFile.NODE_VERSION}`);
    process.exit(1);
  }
  // Data Base Connection
  try {
    await mongoose.connect(envDB_URL, {
      autoIndex: false,
    });
    console.log(`${serverFile.CONNECTION}`);
  } catch (error) {
    console.error(`${serverFile.DB_CONNECTION_FAILED}`, error.message);
    process.exit(1);
  }
  //  Server Start
  try {
    const server = app.listen(envPort, () => {
      console.log(`Server running on port ${envPort}`);
    });
    // Graceful Shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  } catch (error) {
    console.error("Server Error:", error.message);
    process.exit(1);
  }
};
export default startServer;
