import axios from 'axios';
import Client from './client';

export default class Method {
  /**
   * Constructor
   * @param methodOptions
   * @param serviceOptions
   */
  constructor(methodOptions, serviceOptions) {
    this.name = methodOptions.name;
    this.path = methodOptions.path;
    this.method = methodOptions.method;
    this.headers = { ...serviceOptions.headers, ...methodOptions.headers };
    this.serviceOptions = serviceOptions;
    this.timeout = methodOptions.timeout || serviceOptions.timeout || 1000 * 12;
    this.client = this.formClient();
  }
  formClient() {
    const http = axios.create({
      method: this.method,
      baseURL: this.formURL(),
      timeout: this.timeout,
      headers: this.headers,
      responseType: 'json',
      responseEncoding: 'utf8',
      maxRedirects: 0,
      decompress: true
    });

    http.interceptors.request.use(Client.interceptorRequest);
    http.interceptors.response.use(Client.interceptorResponseSuccess, Client.interceptorResponseError);

    return http;
  }
  formURL() {
    let URL = this.serviceOptions.tls === true ? 'https://' : 'http://';

    URL += this.serviceOptions.host;

    if (!this.serviceOptions.host.endsWith('/')) {
      URL += '/';
    }

    return URL;
  }
  execute(payload, options) {
    return this.client.request({
      url: this.path,
      data: payload
    });
  }
}
