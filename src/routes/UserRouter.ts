import * as bcrypt from 'bcrypt'; // hashing library for passwords
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as pgPromise from 'pg-promise';

import { config } from '../../config/config'; // contains key of secret for decoding token
import { db } from '../database';
import { secretKey } from '../../config/secret';

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
export class UsersRouter {
  /**
   * 
   * Get Single User
   * @param req 
   * @param res 
   * @param next 
   */
  // function that takes a user and returns an encoded token that is created with at subject and timestamp
  public static tokenForUser(user:any){
    const timestamp = new Date().getTime()
    const secretToken = jwt.sign({ id: user, iat: timestamp } , secretKey.secret);
    return secretToken;
    // return jwt.encode({sub:user.username, iat:timestamp}, config.secret);
  }
  public static getUser(req: Request, res: Response, next: NextFunction){
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
    // db.one('SELECT * FROM public."Users" WHERE "User_Id" = $1', userId)
      db.any('SELECT row_to_json(t) FROM (SELECT u.*, json_agg(p) FROM public."Users" u JOIN public."Permissions" p ON u."Role" = p."Role" WHERE u."User_Id" = $1 GROUP BY u."User_Id") t ', userId)
      .then((data) => {
        res.status(200)
          .json({
            data,
            status: 'success'
          });
         
      })
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
    db.any('SELECT row_to_json(t) FROM (SELECT u.*, json_agg(p) FROM "Users" u JOIN public."Permissions" p ON u."Role" = p."Role" GROUP BY u."User_Id") t	')
      .then((data) => {
        res.json({
            data,
            success: 'success'
          });

      })
      .catch((err) => next(err));
  }
  // function for signing up a new user
  public static signUp(req: Request, res: Response, next: NextFunction) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const saltRounds = 12;
    if(!email || !password){
      res.status(422).send({error: 'You must provide an email and password'})
  }
  bcrypt.hash(password, saltRounds)
  .then((hash) => {
    // call the createUser query 
    db.one('INSERT INTO public."Users"("Username", "Email", "Password")' + 'VALUES ($1, $2, $3) RETURNING *', [username, email, hash])
      .then((data) => {
        const newUser = UsersRouter.tokenForUser(data);
        res.status(201)
          .json({
            status: 'success',
            token:  newUser      
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
  public static login(req: any, res: any, next: NextFunction) {
    const userToken = this.tokenForUser(req.user)
    res.send({ token: userToken})
   } 
  /**
   * Function to find the user by Id in the database
   */
  public static findUserById(id: number){
    return db.oneOrNone('SELECT * FROM public."Users" WHERE u."User_Id" = $1 ', [id]);
  }
  /**
   * Function to verify if the email address exists in the database
   * @param email 
   */
  public static verifyUser(email: string) {
    const query = 'SELECT * FROM public."Users" WHERE "Email"=$1';
    return db.oneOrNone(query,[email]);
  }
}
