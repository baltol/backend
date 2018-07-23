'use strict';
import * as bodyParser from 'body-parser';
import * as express from 'express';

import { UsersRouter } from './routes/UserRouter';
import { AppConstants } from './utils/AppConstants';

export const app = express();

const version = `v${AppConstants.API_VERSION}`;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// GET Single User
app.get(`/api/${version}/users/:id`, UsersRouter.getUser);
// GET All Users
app.get(`/api/${version}/users`, UsersRouter.getAll);
// CREATE User
app.post(`/api/${version}/users`, UsersRouter.createUser)
// Events

// Default
const defaultRouter = express.Router();
defaultRouter.get('/', (req, res) => res.json({
  message: 'Hello world'
}));
app.use('/', defaultRouter);