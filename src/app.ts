'use strict';
import * as express from 'express';

import { UsersRouter } from './routes/UserRouter';
import { AppConstants } from './utils/AppConstants';

export const app = express();

const version = `v${AppConstants.API_VERSION}`;

// GET Single User
app.use(`/api/${version}/users/:id`, UsersRouter.getUser);
// GET All Users
app.use(`/api/${version}/users`, UsersRouter.getAll);

// Events

// Default
const defaultRouter = express.Router();
defaultRouter.get('/', (req, res) => res.json({
  message: 'Hello world'
}));
app.use('/', defaultRouter);