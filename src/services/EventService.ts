import { db } from '../database';
import { IEventResponse } from '../interfaces/response/IEventResponse';
import { IPaginatedResponse } from '../interfaces/response/IPaginatedResponse';
import { PaginationUtil } from '../utils/PaginationUtil';

export class EventService {

  public static getEvents(pageNum: number, pageSize: number): Promise<IPaginatedResponse<IEventResponse>> {
    const rowCountPromise = db.one<{ numEvents: number }>(`SELECT
    count(*) as "numEvents" FROM public."Events"`)
      .then(data => data.numEvents);

    const eventsPromise = db.many<{ event: IEventResponse }>(`SELECT json_build_object(
      'eventId', e."eventId",
      'name', e."name",
      'description', e."description",
      'address', json_build_object(
        'line1', e."address",
        'line2', e."address2",
        'city', e."city",
        'state', e."state",
        'zip', e."zip",
        'country', e."country",
        'coordinates', json_build_object(
          'latitude', ST_Y(e."gpsLocation"::geometry)::float,
          'longitude', ST_X(e."gpsLocation"::geometry)::float
        )
      ),
      'startDate', e."startDate",
      'endDate', e."endDate",
      'status', e."status",
      'createdBy', e."createdBy",
      'createdOn', e."createdOn",
      'lastUpdated', e."lastUpdated") as event
      FROM public."Events" e
      LIMIT $1 OFFSET $2`, [pageSize, (pageSize * (pageNum - 1))])
      .then(eventsArr => eventsArr.map(it => it.event));

    return Promise.all([rowCountPromise, eventsPromise])
      .then(allResponses => {
        const [numItems, events] = allResponses

        return PaginationUtil.createPaginatedResponse(events, 'events', pageNum, pageSize, numItems);
      })
  }
}