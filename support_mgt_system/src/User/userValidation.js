import Joi from "joi";
export const createUserSchema = Joi.object({
  name: Joi.string().min(4).max(100).required(),
  email: Joi.string().email().required(),
  phoneNo: Joi.string().min(10).max(15).required(),
  address: Joi.string().max(200).required(),
  password: Joi.string().min(6).required(),
  role_Id: Joi.number().valid(3).default(3),
  department: Joi.forbidden(),
  profile_Img: Joi.any().optional(),
});
export const createAgentSchema = Joi.object({
  name: Joi.string().min(4).max(100).required(),
  email: Joi.string().email().required(),
  phoneNo: Joi.string().min(10).max(15).required(),
  address: Joi.string().max(200).required(),
  password: Joi.string().min(6).required(),
  role_Id: Joi.number().valid(2).required(),
  department: Joi.string().required().optional(),
  profile_Img: Joi.any().optional(),
});
export const userUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  phoneNo: Joi.number().optional(),
  address: Joi.string().optional(),
  role_Id: Joi.number().optional().allow(),
  is_active: Joi.number().valid(0, 1).optional(),
});
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});
export const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),

  otp: Joi.string().length(6).required(),

  type: Joi.string().valid("EMAIL_VERIFICATION", "FORGOT_PASSWORD").required(),
});
export const resendOtpSchema = Joi.object({
  email: Joi.string().email().required(),

  type: Joi.string().valid("EMAIL_VERIFICATION", "FORGOT_PASSWORD").required(),
});
export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),

  newPassword: Joi.string().min(6).max(50).required(),
});
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};
