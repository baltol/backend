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
}