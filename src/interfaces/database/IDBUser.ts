export interface IDBUser {
  userId: number;
  username: string;
  email: string;
  lastName?: string;
  firstName?: string;
  companyId?: number;
  aboutMe?: string;
  roleId: number;
  password: string;
}