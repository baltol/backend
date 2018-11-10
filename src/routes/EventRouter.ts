import { NextFunction, Request, Response } from 'express';
import { EventService } from '../services/EventService';
import { AppConstants } from '../utils/AppConstants';
import { ValidationUtil } from '../utils/ValidationUtil';
import { EventRouterSchema as Schema } from './requestSchemas/EventRouterSchema';

export class EventRouter {

  @ValidationUtil.decorator.validateRequest(Schema.GET_EVENTS, 'query')
  public static getEvents(req: Request, res: Response, next: NextFunction) {
    let pageNum: number = AppConstants.DEFAULT_PAGE_NUM
    let pageSize: number = AppConstants.DEFAULT_PAGE_SIZE;

    if (req.query) {
      const parsedPageNum = Number.parseInt(req.query.page, 10)
      if (parsedPageNum) {
        pageNum = parsedPageNum
      }

      const parsedPageSize = Number.parseInt(req.query.size, 10)
      if (parsedPageSize) {
        pageSize = parsedPageSize
      }
    }

    EventService.getEvents(pageNum, pageSize)
      .then(paginatedEventResponse => res.json(paginatedEventResponse))
  }

  // @ValidationUtil.decorator.validateRequest(Schema.INSERT_EVENT, 'query')
  public static insertEvent(req: Request, res: Response, next: NextFunction) {
    // confirm that we are authorized before inserting
    // FIXME there should be a better way to do this
    //  EventRouter.spec will not have req.User
    // so this breaks the tests
    if (!req.user.sub.permissions.createEvents) {
      res.status(401).json({status: 401})
    } else {
    const body = {...req.body, ...{ createdBy: req.user.sub.userId }};

    EventService.insertEvent(body)
        .then(insertEventResponse => res.json(insertEventResponse))
      }
  }
}
