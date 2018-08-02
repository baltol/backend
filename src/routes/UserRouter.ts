import * as bcrypt from 'bcrypt'; // hashing library for passwords
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jwt-simple';
import * as pgPromise from 'pg-promise';

// import { config } from '../../config/config'; // contains key of secret for decoding token

import { secretKey } from '../../config/secret';
import { db } from '../database';


/**
 * Test making call
 */
// var request = require('request');
// var url = ('https://raw.githubusercontent.com/mjhea0/typescript-node-api/master/src/data.json');
// var Users;
// request(url, function (error, response, body) {
//   if (!error && response.statusCode == 200) {
//     Users = JSON.parse(body);
//     console.log(Users);
//   }
// });
/*
**/
export class UserRouter {
  /**
   *
   * Get Single User
   * @param req
   * @param res
   * @param next
   */
  // function that takes a user and returns an encoded token that is created with at subject and timestamp
  public static tokenForUser(data: any) {
    const timestamp = new Date().getTime()
    // const secretToken = jwt.sign({ sub: user.id, iat: timestamp }, secretKey.secret);
    const secretToken = jwt.encode({sub: data, iat: timestamp}, secretKey.secret)
    return secretToken;
  }
  public static getUser(req: Request, res: Response, next: NextFunction) {
    // get the user id from the request
    const userId = parseInt(req.params.id, 10);
    // test the connection to the database
    db.connect()
      .then((obj: pgPromise.IConnected<{}>) => {
        // console.log("testing connection");
        // obj.done(); // success, release the connection;
      })
      .catch((error) => {
        // console.log("ERROR:", error.message);
      });
    db.any(`SELECT json_build_object(
      'UserId', u."UserId",
      'Email', u."Email",
      'Username', u."Username",
      'LastName', u."LastName",
      'FirstName', u."FirstName",
      'CompanyId', u."CompanyId",
      'AboutMe', u."AboutMe",
      'Role', u."Role",
      'Permissions', p.*)
      FROM public."Users" u
      JOIN public."Permissions" p ON u."Role" = p."Role" WHERE u."UserId" = $1`, userId)
      .then(data => res.json(data))
      .catch((err) => next(err));
  }

  /**
   * GET all Users.
   */
  public static getAll(req: Request, res: Response, next: NextFunction) {
    db.connect()
      .then((obj: pgPromise.IConnected<{}>) => {
        // console.log("testing connection");
        // obj.done(); // success, release the connection;
      })
      .catch((error) => {
        // console.log("ERROR:", error.message);
      });

    db.any(`SELECT json_build_object(
      'UserId', u."UserId",
      'Email', u."Email",
      'Username', u."Username",
      'LastName', u."LastName",
      'FirstName', u."FirstName",
      'CompanyId', u."CompanyId",
      'AboutMe', u."AboutMe",
      'Role', u."Role",
      'Permissions', p.*)
      FROM public."Users" u
      JOIN public."Permissions" p ON u."Role" = p."Role"`)
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
      .then((hash) => {
        // call the createUser query
        db.one('INSERT INTO public."Users"("Username", "Email", "Password")' + 'VALUES ($1, $2, $3) RETURNING *', [username, email, hash])
          .then((data) => {
            const newUser = UserRouter.tokenForUser(data);
            res.status(201)
              .json({
                status: 'success',
                token: newUser
              });
          })
          .catch((err) => {
            return next(err)
          })
      })
      .catch((err) => {
        return next(err);
      });
  }
  // function for logging in a user
  public static login(req: Request, res: Response, next: NextFunction) {
    const userToken = UserRouter.tokenForUser(req.body);
    res.send({ token: userToken })
  }
  /**
   * Function to find the user by Id in the database
   */
  public static findUserById(id: number) {
    return db.oneOrNone('SELECT * FROM public."Users" WHERE u."User_Id" = $1 ', [id]);
  }
  /**
   * Function to verify if the email address exists in the database
   * @param email
   */
  public static verifyUser(email: any) {
    const query = 'SELECT * FROM public."Users" WHERE "Email"=$1';
    return db.oneOrNone(query,[email]);
  }
}
