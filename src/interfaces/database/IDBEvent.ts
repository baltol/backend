export interface IDBEvent {
  eventId: number;
  name: string;
  description: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  latitude: string;
  longitude: string;
  startDate: Date;
  endDate: Date;
  status: string; // TODO Define an enum/type for event status
  createdBy: number;
  createdOn: Date;
  lastUpdated: Date;
}