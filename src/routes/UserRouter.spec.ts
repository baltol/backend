import * as bcrypt from 'bcrypt';

import { UserService } from '../services/UserService';
import { UserRouter } from './UserRouter';

const mockPromiseResolve = (obj: any, err = null) => ({
  catch: (errCallback: (err: any) => void) => errCallback(err),
  then: (callback: (obj: any) => void) => callback(obj)
})

describe('UserRouter', () => {

  describe('Sign up', () => {

    const SOME_USERNAME = 'some_username';
    const SOME_PASSWORD = 'some_password';
    const SOME_EMAIL = 'some@email.com'

    let bcryptHashSpy: jasmine.Spy;
    let userServiceInsertSpy: jasmine.Spy;
    let userServiceFindById: jasmine.Spy;
    let userServiceGenToken: jasmine.Spy;
    let mockResponse: { json: jasmine.Spy, status?: jasmine.Spy };
    const mockNextFunc = jasmine.createSpy();

    const SOME_HASH = '8h4jd98uje';
    const SOME_USER_ID = 5;
    const SOME_USER = {
      userId: SOME_USER_ID
    };
    const SOME_USER_WITH_PERMISSIONS = {
      email: SOME_EMAIL,
      userId: SOME_USER_ID,
      username: SOME_USERNAME
    }

    const SOME_VALID_REQUEST = {
      body: {
        email: SOME_EMAIL,
        password: SOME_PASSWORD,
        username: SOME_USERNAME
      }
    };

    const SOME_TOKEN = '5854040idjid83imks';
    const userSignUp = UserRouter.signUp

    beforeEach(() => {
      bcryptHashSpy = spyOn(bcrypt, 'hash').and.returnValue(mockPromiseResolve(SOME_HASH))
      userServiceInsertSpy = spyOn(UserService, 'insertUser').and.returnValue(mockPromiseResolve(SOME_USER))
      userServiceFindById = spyOn(UserService, 'findUserWithPermissionsById').and.returnValue(mockPromiseResolve(SOME_USER_WITH_PERMISSIONS))
      userServiceGenToken = spyOn(UserService, 'generateToken').and.returnValue(SOME_TOKEN)

      mockResponse = {
        json: jasmine.createSpy()
      };
      mockResponse.status = jasmine.createSpy().and.returnValue(mockResponse);
    })

    it('should hash the password', () => {
      userSignUp(SOME_VALID_REQUEST as any, mockResponse as any, mockNextFunc)
      expect(bcryptHashSpy).toHaveBeenCalledWith(SOME_VALID_REQUEST.body.password, jasmine.any(Number))
    });

    it('should insert the user into the database', () => {
      userSignUp(SOME_VALID_REQUEST as any, mockResponse as any, mockNextFunc)
      expect(userServiceInsertSpy).toHaveBeenCalledWith(SOME_VALID_REQUEST.body.username, SOME_VALID_REQUEST.body.email, SOME_HASH)
    });

    it('should retrieve the user (with permissions) based on the ID of the newly inserted user', () => {
      userSignUp(SOME_VALID_REQUEST as any, mockResponse as any, mockNextFunc)
      expect(userServiceFindById).toHaveBeenCalledWith(SOME_USER.userId)
    });

    it('should generate a token based on the retrieved user with permissions', () => {
      userSignUp(SOME_VALID_REQUEST as any, mockResponse as any, mockNextFunc)
      expect(userServiceGenToken).toHaveBeenCalledWith(SOME_USER_WITH_PERMISSIONS)
    });

    it('should respond to the HTTP request with the generated token and the user with permissions', () => {
      userSignUp(SOME_VALID_REQUEST as any, mockResponse as any, mockNextFunc)
      expect(mockResponse.json).toHaveBeenCalledWith({
        token: SOME_TOKEN,
        user: SOME_USER_WITH_PERMISSIONS
      })
    });
  });
});