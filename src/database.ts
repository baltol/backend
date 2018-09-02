import * as pgPromise from 'pg-promise';
import { envConfig } from './utils/envConfig';

const pgp = pgPromise();

export const db = pgp(envConfig.postgresUri);
// test the connection to the database
db.connect()
  .then(connResponse => {
    // console.log("Connected to Postgres Database");
  })
  .catch(error => {
    // console.error("ERROR:", error.message);
  });