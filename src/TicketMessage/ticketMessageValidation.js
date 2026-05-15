import Joi from "joi";

export const createMessageSchema = Joi.object({
  ticket_Id: Joi.number().required(),
  message: Joi.string().required(),
  attachment_Url: Joi.string().optional(),
});

export const updateMessageSchema = Joi.object({
  message: Joi.string().optional(),
  attachment_Url: Joi.string().optional(),
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
