import Joi from "joi";
export const createUserSchema = Joi.object({
  name: Joi.string().min(4).max(100).required(),
  email: Joi.string().email().required(),
  phoneNo: Joi.string().min(10).max(15).required(),
  address: Joi.string().max(200).required(),
  password: Joi.string().min(8).max(20).required(),
  role_Id: Joi.number().valid(3).default(3),
  department: Joi.forbidden(),
  profile_Img: Joi.any().optional(),
});
export const createAgentSchema = Joi.object({
  name: Joi.string().min(4).max(100).required(),
  email: Joi.string().email().required(),
  phoneNo: Joi.string().min(10).max(15).required(),
  address: Joi.string().max(200).required(),
  password: Joi.string().min(8).max(20).required(),
  role_Id: Joi.number().valid(2).default(2),
  department: Joi.number().valid(1, 2, 3).required(),
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

export const resetPasswordValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email",
    "any.required": "Email is required",
  }),
  newPassword: Joi.string()
    .min(8)
    .max(20)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$",
      ),
    )
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password must not exceed 20 characters",
      "any.required": "New password is required",
      "string.pattern.base":
        "Password must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
    }),
});
export const changePasswordValidation = Joi.object({
  oldPassword: Joi.string().required().messages({
    "any.required": "Old password is required",
  }),
  newPassword: Joi.string()
    .min(6)
    .max(20)
    .invalid(Joi.ref("oldPassword"))
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$",
      ),
    )
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password must not exceed 20 characters",
      "any.invalid": "New password must be different from old password",
      "any.required": "New password is required",
      "string.pattern.base":
        "Password must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
    }),
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
