import fs from "fs";
import { STATUS_CODE } from "../helper/statusCode.js";
import { sendResponse } from "../helper/responseHandler.js";
import * as commanFunction from "../../utility/commanFunction.js";
const erroHandler = (err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  // If the error is related to file upload, delete the uploaded file
  if (req.file) {
    commanFunction.deleteFile(req.file.path);
  }
  return sendResponse(
    res,
    STATUS_CODE.SERVER_ERROR,
    "Something went wrong, please try again later",
  );
};
export default erroHandler;
