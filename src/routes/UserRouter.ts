import { NextFunction, Request, Response } from 'express';
import * as pgPromise from 'pg-promise';

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
export class UsersRouter {
  /**
   * 
   * Get Single User
   * @param req 
   * @param res 
   * @param next 
   */
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
            message: `Retrieved User data for User Id ${userId}`,
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
        res.status(200)
          .json({
            data,
            message: 'Retrieved ALL Users',
            status: 'success'
          });

      })
      .catch((err) => next(err));
  }
}