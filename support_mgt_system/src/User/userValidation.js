import Joi from "joi";
export const createUserSchema = Joi.object({
  name: Joi.string().min(4).max(100).required().messages({
    "string.min": "Name must be at least 4 characters long",
    "string.max": "Name must not exceed 100 characters",
    "any.required": "Name is required",
    "string.empty": "Name cannot be empty",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
    "string.empty": "Email cannot be empty",
  }),
  phoneNo: Joi.string().min(10).max(15).required().messages({
    "string.min": "Phone number must be at least 10 digits",
    "string.max": "Phone number must not exceed 15 digits",
    "any.required": "Phone number is required",
    "string.empty": "Phone number cannot be empty",
  }),
  address: Joi.string().max(200).required().messages({
    "string.max": "Address must not exceed 200 characters",
    "any.required": "Address is required",
    "string.empty": "Address cannot be empty",
  }),
  password: Joi.string()
    .min(8)
    .max(20)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$",
      ),
    )
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password must not exceed 20 characters",
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty",
      "string.pattern.base":
        "Password must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
    }),
  role_Id: Joi.number().valid(3).default(3),
  department: Joi.forbidden(),
  profile_Img: Joi.any().optional(),
});
export const createAgentSchema = Joi.object({
  name: Joi.string().min(4).max(100).required().messages({
    "string.min": "Name must be at least 4 characters long",
    "string.max": "Name must not exceed 100 characters",
    "any.required": "Name is required",
    "string.empty": "Name cannot be empty",
  }),
   email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
    "string.empty": "Email cannot be empty",
  }),
 phoneNo: Joi.string().min(10).max(15).required().messages({
    "string.min": "Phone number must be at least 10 digits",
    "string.max": "Phone number must not exceed 15 digits",
    "any.required": "Phone number is required",
    "string.empty": "Phone number cannot be empty",
  }),
  address: Joi.string().max(200).required().messages({
    "string.max": "Address must not exceed 200 characters",
    "any.required": "Address is required",
    "string.empty": "Address cannot be empty",
  }),
password: Joi.string()
    .min(8)
    .max(20)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$",
      ),
    )
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password must not exceed 20 characters",
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty",
      "string.pattern.base":
        "Password must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
    }),
  role_Id: Joi.number().valid(2).default(2),
  department: Joi.number().valid(1, 2, 3).required(),
  profile_Img: Joi.any().optional(),
});
export const userUpdateSchema = Joi.object({
   name: Joi.string().min(4).max(100).optional().messages({
    "string.min": "Name must be at least 4 characters long",
    "string.max": "Name must not exceed 100 characters",
    "string.empty": "Name cannot be empty",
  }),
 phoneNo: Joi.string().min(10).max(15).optional().messages({
    "string.min": "Phone number must be at least 10 digits",
    "string.max": "Phone number must not exceed 15 digits",
    "string.empty": "Phone number cannot be empty",
  }),
   address: Joi.string().max(200).required().messages({
    "string.max": "Address must not exceed 200 characters",
    "any.required": "Address is required",
    "string.empty": "Address cannot be empty",
  }),
    address: Joi.string().max(200).optional().messages({
    "string.max": "Address must not exceed 200 characters",
    "string.empty": "Address cannot be empty",
  }),
});
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
    "string.empty": "Email cannot be empty",
  }),
});
export const verifyOtpSchema = Joi.object({
 email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
    "string.empty": "Email cannot be empty",
  }),
  otp: Joi.string().length(6).required().messages({
    "string.length": "OTP must be exactly 6 digits",
    "any.required": "OTP is required",
    "string.empty": "OTP cannot be empty",
  }),
  type: Joi.string()
    .valid("EMAIL_VERIFICATION", "FORGOT_PASSWORD")
    .required()
    .messages({
      "any.only":
        "Type must be either EMAIL_VERIFICATION or FORGOT_PASSWORD",
      "any.required": "Type is required",
      "string.empty": "Type cannot be empty",
    }),
});
export const resendOtpSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
    "string.empty": "Email cannot be empty",
  }),
  type: Joi.string()
    .valid("EMAIL_VERIFICATION", "FORGOT_PASSWORD")
    .required()
    .messages({
      "any.only":
        "Type must be either EMAIL_VERIFICATION or FORGOT_PASSWORD",
      "any.required": "Type is required",
      "string.empty": "Type cannot be empty",
    }),
});

export const resetPasswordValidation = Joi.object({
 email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
    "string.empty": "Email cannot be empty",
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
