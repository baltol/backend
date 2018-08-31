export interface IEventResponse {
  eventId: number;
  name: string;
  description: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    coordinates: {
      latitude: string;
      longitude: string;
    }
  };
  startDate: Date;
  endDate: Date;
  status: string; // TODO Define an enum/type for event status
  createdBy: number;
  createdOn: Date;
  lastUpdated: Date;
}