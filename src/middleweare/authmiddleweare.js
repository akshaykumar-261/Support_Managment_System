import jwt from "jsonwebtoken"
import User from "../../dataBase/models/user.js";
import Role from "../../dataBase/models/roles.js";
import {authMessage} from "../helper/commanMessage.js";
import {sendResponse} from "../helper/responseHandler.js";
import { STATUS_CODE } from "../helper/statusCode.js"
const authorize = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return sendResponse(res,STATUS_CODE.BAD_REQUEST,authMessage.UN_AUTH)
        }
        const token = authHeader.split(" ")[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({
            where: {
                id: decode.id,
                is_active: 1
            },
            include: [
                {
                    model: Role,
                    attributes: ["name"],
                },
            ],
        });
        if (!user) {
            return sendResponse(res, STATUS_CODE.BAD_REQUEST, authMessage.USER_NOT_FOUND);
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("Authorization error", error.message);
        return sendResponse(res, STATUS_CODE.SERVER_ERROR, authMessage.INVALID);
    }
}
export default authorize;