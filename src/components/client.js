import logger from '../logger';
const Client = {};

Client.interceptorRequest = (request) => {
  const {method, url, data} = request;

  logger.info('API Request', method, url, data);
  return request;
};

Client.interceptorResponseSuccess = (response) => {
  const {status, config, data} = response;

  logger.info('API', status, config.method, config.url, response);
  return data;
};

Client.interceptorResponseError = (error) => {
  if (error.response) {
    logger.error('API', error.response.status, error.response.config.url, error.response);
  } else if (error.request) {
    logger.error('The request was made but no response was received');
  } else {
    logger.error('Something happened in setting up the request that triggered an error');
  }
  return Promise.reject(error);
};

module.exports = Client;
