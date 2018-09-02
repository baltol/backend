import * as jwt from 'jwt-simple';

import { db } from '../database';
import { IDBUser } from '../interfaces/database/IDBUser';
import { IDBUserWithPermissions } from '../interfaces/database/IDBUserWithPermissions';
import { envConfig } from '../utils/envConfig';

export class UserService {

  // function that takes a user and returns an encoded token that is created with at subject and timestamp
  public static generateToken(data: IDBUserWithPermissions) {
    const timestamp = Date.now();
    return jwt.encode({ sub: data, iat: timestamp }, envConfig.jwtSecretKey)
  }

  public static insertUser(username: string, email: string, password: string): Promise<IDBUser> {
    return db.one(`INSERT INTO public."Users"("username", "email", "password", "roleId") VALUES ($1, $2, $3, $4) RETURNING *`,
      [username, email, password, UserService.REGULAR_USER_ROLE_ID]);
  }

  public static findUserWithPermissionsById(userId: number): Promise<IDBUserWithPermissions> {
    return db.one<{ user: IDBUserWithPermissions }>(`SELECT json_build_object(
      'userId', u."userId",
      'email', u."email",
      'username', u."username",
      'lastName', u."lastName",
      'firstName', u."firstName",
      'companyId', u."companyId",
      'aboutMe', u."aboutMe",
      'permissions', r.*) as user
      FROM public."Users" u
      JOIN public."Roles" r ON u."roleId" = r."roleId" WHERE u."userId" = $1 LIMIT 1`, userId)
      .then(data => data.user)
  }

  public static findUserWithPermissionsByEmail(email: string): Promise<IDBUserWithPermissions> {
    return db.one<{ user: IDBUserWithPermissions }>(`SELECT json_build_object(
      'userId', u."userId",
      'email', u."email",
      'username', u."username",
      'lastName', u."lastName",
      'firstName', u."firstName",
      'companyId', u."companyId",
      'aboutMe', u."aboutMe",
      'permissions', r.*) as user
      FROM public."Users" u
      JOIN public."Roles" r ON u."roleId" = r."roleId" WHERE u."email" LIKE $1 LIMIT 1`, email)
      .then(data => data.user)
  }

  public static getAll(): Promise<IDBUserWithPermissions[]> {

    return db.many<{ user: IDBUserWithPermissions }>(`SELECT json_build_object(
      'userId', u."userId",
      'email', u."email",
      'username', u."username",
      'lastName', u."lastName",
      'firstName', u."firstName",
      'companyId', u."companyId",
      'aboutMe', u."aboutMe",
      'permissions', r.*) as user
      FROM public."Users" u
      JOIN public."Roles" r ON u."roleId" = r."roleId"`)
      .then((dataArr) => dataArr.map(it => it.user))
  }

  private static REGULAR_USER_ROLE_ID = 1;
}