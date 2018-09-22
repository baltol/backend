export class UserRouterSchema {

  public static GET_USER = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    additionalProperties: false,
    properties: {
      id: {
        type: 'number'
      }
    },
    required: ['id'],
    type: 'object'
  }

  public static SIGN_UP = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    additionalProperties: false,
    properties: {
      email: {
        maxLength: 100,
        minLength: 4,
        type: 'string'
      },
      password: {
        maxLength: 100,
        minLength: 6,
        type: 'string'
      },
      username: {
        maxLength: 100,
        minLength: 4,
        type: 'string'
      }
    },
    required: ['email', 'password', 'username'],
    type: 'object'
  }

  public static LOGIN = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    additionalProperties: false,
    properties: {
      email: {
        maxLength: 100,
        minLength: 4,
        type: 'string'
      },
      password: {
        maxLength: 100,
        minLength: 6,
        type: 'string'
      }
    },
    required: ['email', 'password'],
    type: 'object'
  }
}