import { AppConstants } from '../../utils/AppConstants';

export class EventRouterSchema {

  public static GET_EVENTS = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    additionalProperties: false,
    properties: {
      page: {
        minimum: 1,
        type: 'number'
      },
      size: {
        maximum: AppConstants.DEFAULT_MAX_PAGE_SIZE,
        minimum: AppConstants.DEFAULT_MIN_PAGE_SIZE,
        type: 'number'
      }
    },
    type: 'object'
  }

  public static INSERT_EVENT = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    additionalProperties: false,
    properties: {
      address: {
        properties: {
          city: {
            maxLength: 50,
            minLength: 4,
            type: 'string'
          },
          coordinates: {
            propertites: {
              langitude: {
                type: 'number'
              },
              latitude: {
                type: 'number'
              }
            },
            type: 'object'
          },
          country: {
            maxLength: 50,
            minLength: 4,
            type: 'string'
          },
          line1: {
            maxLength: 50,
            minLength: 4,
            type: 'string'
          },
          line2: {
            maxLength: 50,
            minLength: 4,
            type: 'string'
          },
          state: {
            maxLength: 50,
            minLength: 4,
            type: 'string'
          },
          zip: {
            maxLength: 50,
            minLength: 4,
            type: 'string'
          }
        },
        required: ['city', 'state', 'zip', 'country'],
        type: 'object'
      },
      description: {
        maxLength: 50,
        minLength: 4,
        type: 'string'
      },
      endDate: {
        format: 'date-time',
        type: 'string'
      },
      name: {
        maxLength: 50,
        minLength: 4,
        type: 'string'
      },
      size: {
        maximum: AppConstants.DEFAULT_MAX_PAGE_SIZE,
        minimum: AppConstants.DEFAULT_MIN_PAGE_SIZE,
        type: 'number'
      },
      startDate: {
        format: 'date-time',
        type: 'string'
      }
    },
    required: ['name', 'address', 'startDate', 'endDate'],
    type: 'object'
  }

}
