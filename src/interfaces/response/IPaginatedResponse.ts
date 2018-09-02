import { IPagination } from './IPagination'

export interface IPaginatedResponse<T> {
  pagination: IPagination;
  events?: T[];
  items?: T[];
  users?: T[];
  threads?: T[];
}