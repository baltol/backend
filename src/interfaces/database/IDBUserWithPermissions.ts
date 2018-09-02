import { IDBRole } from './IDBRole';

export interface IDBUserWithPermissions {
  userId: number;
  username: string;
  email: string;
  lastName?: string;
  firstName?: string;
  companyId?: number;
  aboutMe?: string;
  permissions: IDBRole;
}