import { sequelize } from "./db.js";
import { serverFile } from "../src/helper/commanMessage.js";

const startServer = (app) => {
  const envPort = process.env.PORT || 8088;
  sequelize
    .authenticate()
    .then(() => {
      console.log(serverFile.CONNECTION);
      const server = app.listen(envPort, () => {
        console.log(`Server is running on port ${envPort}`);
      });
      server.on("error", (error) => {
        console.error(serverFile.SERVER_ERROR, error.message);
      });
    })
    .catch((error) => {
      console.error(serverFile.ERROR, error.message);
    });
  process.on("SIGINT", () => {
    sequelize
      .close()
      .then(() => {
        console.log("Database connection closed");
        process.exit(0);
      })
      .catch((error) => {
        console.error("Database Closing Error:", error.message);
      });
  });
};

export default startServer;
