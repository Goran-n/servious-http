import Method from './method';

export default class Service {
  constructor(serviceOptions, explorerOptions = {}) {
    this.name = serviceOptions.name;
    this.options = {
      host: serviceOptions.host,
      tls: serviceOptions.tls === true,
      headers: serviceOptions.headers,
    };
    this.methods = {};
  }
  addMethod(methodOptions) {
    this.methods[methodOptions.name] = new Method(methodOptions, this.options);
  }
  getMethod(name) {
    if (!this.methods[name]) {
      throw new Error(`Method ${name} is not defined in service ${this.name}`);
    }
    return this.methods[name];
  }
}
