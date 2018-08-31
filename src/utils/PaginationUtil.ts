import { IPaginatedResponse } from '../interfaces/response/IPaginatedResponse';
import { IPagination } from '../interfaces/response/IPagination';

type KNOWN_KEYS_TYPE = 'items' | 'events' | 'threads' | 'posts' | 'users'
const KNOWN_KEYS = ['items', 'events', 'threads', 'posts', 'users'];

export class PaginationUtil {

  public static createPaginatedResponse<T>(pageItems: T[], key: KNOWN_KEYS_TYPE, pageNum: number, pageSize: number, totalNumItems: number): IPaginatedResponse<T> {
    if (!KNOWN_KEYS.includes(key)) {
      throw new Error(`${key} is not a known pagination key. Must be one of: ${KNOWN_KEYS.join(', ')}`);
    }

    return {
      [key]: pageItems,
      pagination: PaginationUtil.createPagination(pageNum, pageSize, totalNumItems)
    }
  }

  public static createPagination(pageNum: number, pageSize: number, totalNumItems: number): IPagination {
    return {
      currentPage: pageNum,
      numItems: totalNumItems,
      pageSize,
      totalPages: Math.ceil(totalNumItems / pageSize)
    }
  }
}