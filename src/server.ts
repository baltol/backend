/**
 * This file is for implementing the server
 * to listen for incoming connections
 */
import * as http from 'http';

import { app } from './app';
import { envConfig } from './utils/envConfig';

// listen for the connection
const server = http.createServer(app);
server.listen(envConfig.port, (err: Error) => {
  if (err) {
    // console.error(err)
  }
  // tslint:disable-next-line:no-console
  console.info('Server started on port %s.', envConfig.port);
});
