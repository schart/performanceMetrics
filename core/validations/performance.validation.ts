import Joi from "joi";

export const validateListPerformanceParams = (query: any) => {
  const schema = Joi.object({
    start: Joi.date().iso().optional(),
    end: Joi.date().iso().optional(),
    device: Joi.string().valid("cpu", "ram", "disk").optional(),
    page: Joi.number().integer().min(1).optional().default(1),
    pageSize: Joi.number().integer().min(1).max(100).optional().default(10),
  });

  return schema.validate(query);
};

export const validateListComputerId = (query: any) => {
  const schema = Joi.object({
    computerId: Joi.string().required(),
  });

  return schema.validate(query);
};

export const validateCreateUser = (query: any) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    name: Joi.string().min(1).max(50).required(),
    lastName: Joi.string().min(1).max(50).required(),
    version: Joi.number().integer().min(1).required(),
  });
  return schema.validate(query);
};
