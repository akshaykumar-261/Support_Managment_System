import Joi from "joi";
export const createTicketSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().required(),
  priority: Joi.string().valid("low", "medium", "high").required(),
  department_Id: Joi.number().optional(),
});
export const updateStatusSchema = Joi.object({
  status: Joi.string().valid("open", "in_progress", "closed").required(),
});
export const prioritySchema = Joi.object({
  priority: Joi.string().valid("low", "medium", "high").required(),
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
