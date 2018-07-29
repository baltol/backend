// This is not in use yet. I would like to implement some sort of schema here for data manipulation...
export class Users {
  private _username: string;
  private _email: string;
  private _password: string;
  private _id: number;

  public get username(): string {
    return this._username;
  }

  public get email(): string {
    return this._email;
  }

  public get password(): string {
    return this._password;
  }

  public get id(): number {
    return this._id;
  }
}
