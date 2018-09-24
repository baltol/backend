import { PaginationUtil } from './PaginationUtil';

describe('PaginationUtil', () => {

  const SOME_PAGE_NUM = 5;
  const SOME_PAGE_SIZE = 20;
  const SOME_TOTAL_ITEMS = 100;

  describe('createPagination', () => {

    it('should return the current page number', () => {
      expect(PaginationUtil.createPagination(SOME_PAGE_NUM, SOME_PAGE_SIZE, SOME_TOTAL_ITEMS).currentPage)
        .toEqual(SOME_PAGE_NUM);
    });

    it('should return the size of the page', () => {
      expect(PaginationUtil.createPagination(SOME_PAGE_NUM, SOME_PAGE_SIZE, SOME_TOTAL_ITEMS).pageSize)
        .toEqual(SOME_PAGE_SIZE);
    });

    it('should return the total number of items', () => {
      expect(PaginationUtil.createPagination(SOME_PAGE_NUM, SOME_PAGE_SIZE, SOME_TOTAL_ITEMS).numItems)
        .toEqual(SOME_TOTAL_ITEMS);
    });

    it('should return the computed number of pages', () => {
      expect(PaginationUtil.createPagination(SOME_PAGE_NUM, SOME_PAGE_SIZE, SOME_TOTAL_ITEMS).totalPages)
        .toEqual(Math.ceil(SOME_TOTAL_ITEMS / SOME_PAGE_SIZE));
    });

  });

});