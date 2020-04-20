import Joi from '@hapi/joi';

const internals = {};

exports.apply = function(type, options, ...message) {
  const result = internals[type].validate(options);

  if (result.error) {
    throw new Error(`Invalid ${type} options ${message.length ?
      `(${ message.join(' ') })` : ''} ${result.error.annotate()}`);
  }

  return result.value;
};

internals.serviceObject = Joi.object({
  name: Joi.string().required().min(1),
  host: Joi.string().required().min(8),
  tls: Joi.boolean().default(false),
  headers: Joi.object().default({}),
  methods: Joi.object().default({}),
});

internals.serviceMethodObject = Joi.object({
  name: Joi.string().required().min(1),
  path: Joi.string().min(4),
  method: Joi.string().default('POST'),
  headers: Joi.object().default({}),
});
