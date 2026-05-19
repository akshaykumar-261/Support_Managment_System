import Joi from "joi";
export const createUserSchema = Joi.object({
  name: Joi.string().max(100).required(),
  email: Joi.string().email().required(),
  phoneNo: Joi.string().max(10).required(),
  address: Joi.string().max(200).required(),
  password: Joi.string().min(6).required(),
  role_Id: Joi.string().required(),
  department: Joi.string().required().optional(),
});
export const userUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  phoneNo: Joi.number().optional(),
  address: Joi.string().optional(),
  role_Id: Joi.number().optional().allow(),
  is_active: Joi.number().valid(0, 1).optional(),
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