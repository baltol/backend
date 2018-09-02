import * as bcrypt from 'bcrypt'; // hashing library for passwords
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jwt-simple';
import * as pgPromise from 'pg-promise';

// import { config } from '../../config/config'; // contains key of secret for decoding token

import { secretKey } from '../../config/secret';
import { db } from '../database';
import { IDBUser } from '../interfaces/database/IDBUser';
import { UserService } from '../services/UserService';

export class UserRouter {
  /**
   *
   * Get Single User
   * @param req
   * @param res
   * @param next
   */
  public static getUser(req: Request, res: Response, next: NextFunction) {
    // get the user id from the request
    const userId = parseInt(req.params.id, 10);

    UserService.findUserWithPermissionsById(userId)
      .then(user => res.json(user))
      .catch(err => {
        if (err instanceof pgPromise.errors.QueryResultError) {
          // The requested user was not found, respond with a 404 Not Found
          res.status(404).end();
        }
        next(err);
      });
  }

  /**
   * GET all Users.
   */
  public static getAll(req: Request, res: Response, next: NextFunction) {
    UserService.getAll()
      .then((data) => res.json(data))
      .catch((err) => next(err));
  }
  // function for signing up a new user
  public static signUp(req: Request, res: Response, next: NextFunction) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const saltRounds = 12;
    if (!email || !password) {
      res.status(422).send({ error: 'You must provide an email and password' })
    }
    bcrypt.hash(password, saltRounds)
      .then(hash => UserService.insertUser(username, email, hash))
      .then(dbUser => UserService.findUserWithPermissionsById(dbUser.userId))
      .then(userWithPermissions => {
        res.status(201)
          .json({
            token: UserService.generateToken(userWithPermissions),
            user: userWithPermissions
          })
      })
      .catch(err => next(err));
  }
  // function for logging in a user
  public static login(req: Request, res: Response, next: NextFunction) {

    UserService.findUserWithPermissionsByEmail(req.body.email)
      .then(userWithPermissions => res.json({
        token: UserService.generateToken(userWithPermissions),
        user: userWithPermissions
      })
      )
      .catch(err => next(err));
  }
  /**
   * Function to find the user by Id in the database
   */
  public static findUserById(id: number) {
    return db.oneOrNone('SELECT * FROM public."Users" WHERE "userId" = $1', [id]);
  }
  /**
   * Function to verify if the email address exists in the database
   * @param email
   */
  public static verifyUser(email: string): Promise<IDBUser> {
    const query = 'SELECT * FROM public."Users" WHERE "email"=$1';
    return db.oneOrNone<IDBUser>(query, [email]);
  }
}
