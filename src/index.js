import config from './config';
const optionsBuilder = require('./options-builder');

import Service from './components/service';

const Servious = {
  options: optionsBuilder({}),
  services: {},
  registerService(serviceOptions) {
    const service = config.apply('serviceObject', serviceOptions);

    this.services[serviceOptions.name] = new Service(service, {});
  },
  getService(name) {
    if (!this.services[name]) {
      throw new Error(`Service ${name} is not defined`);
    }
    return this.services[name];
  },
  addMethod(targetService, methodOptions) {
    if (!methodOptions.path && methodOptions.name) {
      methodOptions.path = methodOptions.name;
    }

    const link = config.apply('serviceMethodObject', methodOptions);

    this.getService(targetService).addMethod(link);
  },
  async send(targetService, targetMethod, payload, options) {
    const service = this.getService(targetService);
    const method = service.getMethod(targetMethod);

    return method.execute(payload, options);
  },
};

module.exports = Servious;

Servious.registerService({
  name: 'agents',
  host: 'localhost:9990',
});

Servious.addMethod('agents', {
  name: 'query',
  method: 'post',
});

Servious.send('agents', 'query', {test: 'test'}).then((resp) => {
  console.log(resp);
});
