import jwt from "jsonwebtoken";
import EmployeModel from "../models/EmployesModel.js";

const authorize = async (req, res, next) => {
  try {
    /*
      =========================
      AUTH HEADER VALIDATION
      =========================
    */
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }

    /*
      =========================
      TOKEN FORMAT VALIDATION
      =========================
    */
    const bearerToken = authHeader.split(" ");

    if (
      bearerToken.length !== 2 ||
      bearerToken[0] !== "Bearer"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    const token = bearerToken[1];

    /*
      =========================
      VERIFY JWT TOKEN
      =========================
    */
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    /*
      =========================
      CHECK USER IN DATABASE
      =========================
    */
    const user = await EmployeModel.findOne({
      _id: decoded.id,
      is_active: true,
      deleted_at: null,
    })
      .select("-password -refreshToken")
      .populate("role", "name");

    /*
      =========================
      USER VALIDATION
      =========================
    */
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found or inactive",
      });
    }

    /*
      =========================
      ATTACH USER TO REQUEST
      =========================
    */
    req.user = user;

    next();

  } catch (error) {

    /*
      =========================
      JWT ERROR HANDLING
      =========================
    */
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    /*
      =========================
      SERVER ERROR
      =========================
    */
    console.error(
      `Authorization Middleware Error: ${error.message}`
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default authorize;