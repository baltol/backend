import { EventService } from '../services/EventService'
import { PaginationUtil } from '../utils/PaginationUtil';

import { EventRouter } from './EventRouter'

const mockPromiseResolve = (obj: any, err = null) => ({
  catch: (errCallback: (err: any) => void) => errCallback(err),
  then: (callback: (obj: any) => void) => callback(obj)
})

describe('EventRouter', () => {

  let eventServiceGetEventsSpy: jasmine.Spy
  let eventServiceInsertSpy: jasmine.Spy
  const mockNextFunc = jasmine.createSpy()
  const mockResponse = {
    json: jasmine.createSpy(),
    status: jasmine.createSpy()
  }
  mockResponse.status = jasmine.createSpy().and.returnValue(mockResponse);

  const SOME_ITEMS = Array(50).fill(0)
  const SOME_PAGE_NUM = 1
  const SOME_PAGE_SIZE = 5
  const getMockPaginatedResponse = (pageNum: number, pageSize: number) => PaginationUtil.createPaginatedResponse(SOME_ITEMS, 'events', pageNum, pageSize, SOME_ITEMS.length)
  const getMockRequest = (pageNum: number, pageSize: number) => ({
    query: {
      page: pageNum,
      size: pageSize
    }
  })
  const SOME_USER_ID = 5;
  const SOME_EVENT = {
    userId: SOME_USER_ID
  };

  // const SOME_HASH = '8h4jd98uje';

  const SOME_VALID_REQUEST = {
    body: {
      description: 'A fake event like no other.',
      name: 'Fake Event'
    }
  };

  beforeEach(() => {
    eventServiceGetEventsSpy = spyOn(EventService, 'getEvents').and.callFake((page: number, size: number) => {
      return mockPromiseResolve(getMockPaginatedResponse(page, size))
    })
    eventServiceInsertSpy = spyOn(EventService, 'insertEvent').and.returnValue(mockPromiseResolve(SOME_EVENT))

  })

  it('should fetch the requested number of events from the requested page', () => {
    EventRouter.getEvents(getMockRequest(SOME_PAGE_NUM, SOME_PAGE_SIZE) as any, mockResponse as any, mockNextFunc as any)
    expect(eventServiceGetEventsSpy).toHaveBeenCalledWith(SOME_PAGE_NUM, SOME_PAGE_SIZE)
  });

  it('should respond to the HTTP request with the paginated set of events', () => {
    EventRouter.getEvents(getMockRequest(SOME_PAGE_NUM, SOME_PAGE_SIZE) as any, mockResponse as any, mockNextFunc as any)
    expect(mockResponse.json).toHaveBeenCalledWith(getMockPaginatedResponse(SOME_PAGE_NUM, SOME_PAGE_SIZE))
  });

  it('should insert the event into the database', () => {
    EventRouter.insertEvent(SOME_VALID_REQUEST as any, mockResponse as any, mockNextFunc)
    expect(eventServiceInsertSpy).toHaveBeenCalledWith(SOME_VALID_REQUEST.body)
  });

});
