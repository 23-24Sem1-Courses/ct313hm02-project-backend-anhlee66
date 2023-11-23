class Paginator {
  constructor(page = 1, limit = 5) {
    this.page = parseInt(page, 10);
    if (isNaN(this.page) || this.page < 1) {
      this.page = 1;
    }
    this.limit = parseInt(limit, 10);
    if (isNaN(this.limit) || this.limit < 1) {
      this.limit = 5;
    }
    this.offset = (this.page - 1) * this.limit;
  }
  getMetaData(totalRecord) {
    if (totalRecord == 0) {
      return {};
    }
    let totalPage = Math.ceil(totalRecord / this.limit);
    return {
      totalPage: totalPage,
      firstPage: 1,
      lastPage: totalPage,
      page: this.page,
      limit: this.limit,
    };
  }
}
module.exports = Paginator;
