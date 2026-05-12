/**
 * Input validation middleware factory using Joi.
 *
 * Usage:
 *   const Joi = require('joi');
 *   router.post('/', validate(schema), controller.create);
 *
 *   where schema is:
 *   {
 *     body: Joi.object({ name: Joi.string().required() }),
 *     params: Joi.object({ id: Joi.string().uuid() }),
 *     query: Joi.object({ page: Joi.number().integer().min(1) }),
 *   }
 */

function validate(schema) {
  return (req, _res, next) => {
    const targets = ['body', 'params', 'query'];

    for (const target of targets) {
      if (!schema[target]) continue;

      const { error, value } = schema[target].validate(req[target], {
        abortEarly: false,
        stripUnknown: true,
        convert: true,
      });

      if (error) {
        error.isJoi = true;
        return next(error);
      }

      // Replace with sanitized / coerced values
      req[target] = value;
    }

    next();
  };
}

module.exports = { validate };
