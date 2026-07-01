import UserDeviceModel from "../dataBase/models/userDevice.js";
import { Op } from "sequelize";
import cron from "node-cron";

cron.schedule("* * * * *", async () => {
  try {
    const expiryDate = new Date(Date.now() - 2 * 60 * 1000);

    await UserDeviceModel.update(
      {
        is_login: false,
        logout_time: new Date(),
      },
      {
        where: {
          is_login: true,
          login_time: {
            [Op.lte]: expiryDate,
          },
        },
      }
    );

    console.log("Cron executed");
  } catch (err) {
    console.log(err);
  }
});