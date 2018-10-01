import { db } from '../database';
import { IDBEvent } from '../interfaces/database/IDBEvent';
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

  public static insertEvent(body: IEventResponse): Promise<IDBEvent> {
    // tslint:disable:prefer-object-spread
    const dBEvent = Object.assign({}, {
      address: body.address.line1,
      address2: body.address.line2,
      city: body.address.city,
      country: body.address.country,
      createdBy: 1,
      createdOn: new Date().toISOString(),
      description: body.description,
      endDate: body.endDate,
      lastUpdated: new Date().toISOString(),
      latitude: body.address.coordinates.latitude,
      longitude: body.address.coordinates.longitude,
      name: body.name,
      startDate: body.startDate,
      state: body.address.state,
      status: body.status,
      zip: body.address.zip
    })

    return db.one('INSERT INTO public."Events"(name, description, address, address2, city, state, country, zip, "createdBy", "createdOn", "lastUpdated", "startDate", "endDate") VALUES($<name>, $<description>, $<address>, $<address2>, $<city>, $<state>, $<country>, $<zip>, $<createdBy>, now(), now(), now(), now())', dBEvent);
  }
}
