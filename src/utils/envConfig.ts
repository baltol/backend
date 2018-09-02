import { IEnvConfig } from '../interfaces/IEnvConfig';
const KNOWN_ENVS = ['local', 'development', 'production'];
const env = process.env.NODE_ENV;

let config;
try {
  // tslint:disable-next-line:no-var-requires
  config = require('../config').config
} catch (e) {
  if (env === 'local') {
    throw new Error('Environment config file "src/config.ts" is missing!')
  }
  config = null;
}

if (!env) {
  throw new Error('Failed to load environment configuration - NODE_ENV is not defined');
}

if (KNOWN_ENVS.indexOf(env) === -1) {
  throw new Error(`Failed to load environment configuration - Unrecognized NODE_ENV "${process.env.NODE_ENV}"`);
}

if (env === 'production') {
  // tslint:disable-next-line:no-console
  console.warn('\n\n******\nWARNING: This server is connected to the production database!\n******\n\n');
}

export const envConfig: IEnvConfig = {
  apiPrefix: env === 'local' ? 'api' : '',
  jwtSecretKey: process.env.AZURE_JWT_SECRET_KEY || config[env].jwtSecretKey,
  port: process.env.PORT || process.env.port || config[env].port,
  postgresUri: process.env.AZURE_POSTGRES_URI || config[env].postgresUri
}