import { NextFunction, Request, Response } from 'express';
import { EventService } from '../services/EventService';
import { AppConstants } from '../utils/AppConstants';

export class EventRouter {


  public static getEvents(req: Request, res: Response, next: NextFunction) {
    let pageNum: number = AppConstants.DEFAULT_PAGE_NUM
    let pageSize: number = AppConstants.DEFAULT_PAGE_SIZE;

    if (req.query) {
      const parsedPageNum = Number.parseInt(req.query.page)
      if (parsedPageNum) {
        pageNum = parsedPageNum
      }

      const parsedPageSize = Number.parseInt(req.query.size)
      if (parsedPageSize) {
        pageSize = parsedPageSize
      }
    }

    if (pageSize > AppConstants.DEFAULT_MAX_PAGE_SIZE) {
      pageSize = AppConstants.DEFAULT_MAX_PAGE_SIZE
    } else if (pageSize < AppConstants.DEFAULT_MIN_PAGE_SIZE) {
      pageSize = AppConstants.DEFAULT_MIN_PAGE_SIZE
    }

    EventService.getEvents(pageNum, pageSize)
      .then(paginatedEventResponse => res.json(paginatedEventResponse))
  }

  private static MAX_PAGE_SIZE = 100;
}