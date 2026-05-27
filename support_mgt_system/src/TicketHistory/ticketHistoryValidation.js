import Joi from "joi";

export const reAssignSchema = Joi.object({
  ticket_Id: Joi.alternatives().try(Joi.number(), Joi.string()).optional(),
  ticket_number: Joi.string().optional(),
  assign_To: Joi.number().required(),
  assign_From: Joi.alternatives().try(Joi.number(), Joi.string()).optional(),
  assign_By: Joi.alternatives().try(Joi.number(), Joi.string()).optional(),
  action: Joi.string()
    .valid(
      "created",
      "assigned",
      "reassigned",
      "status_changed",
      "priority_changed",
      "resolved",
      "closed",
      "reopened",
    )
    .optional(),
  old_Status: Joi.string().optional(),
  new_Status: Joi.string().optional(),
  old_Priority: Joi.string().optional(),
  new_Priority: Joi.string().optional(),
  from_Department: Joi.number().optional(),
  to_Department: Joi.number().optional(),
});
// require at least one of ticket_Id or ticket_number
export const reAssignSchemaValidated = reAssignSchema.or("ticket_Id", "ticket_number");

export const updateHistorySchema = Joi.object({
  assign_To: Joi.number().optional(),
  assign_From: Joi.number().optional(),
  assign_By: Joi.number().optional(),
  action: Joi.string()
    .valid(
      "created",
      "assigned",
      "reassigned",
      "status_changed",
      "priority_changed",
      "resolved",
      "closed",
      "reopened",
    )
    .optional(),
  old_Status: Joi.string().optional(),
  new_Status: Joi.string().optional(),
  old_Priority: Joi.string().optional(),
  action_By: Joi.number().optional(),
  from_Department: Joi.number().optional(),
  to_Department: Joi.number().optional(),
});
export const idParamSchema = Joi.object({
  id: Joi.number().required(),
});

export const agentIdParamSchema = Joi.object({
  agentId: Joi.number().required(),
});

export const ticketIdParamSchema = Joi.object({
  ticket_Id: Joi.number().required(),
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
export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};
