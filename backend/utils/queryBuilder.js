export class MySQLQueryBuilder {
  constructor(baseQuery) {
    this.baseQuery = baseQuery;
    this.where = [];
    this.params = [];
  }

  add(condition, value) {
    if (value !== undefined && value !== null && value !== "") {
      this.where.push(condition);
      this.params.push(value);
    }
    return this;
  }

  addLike(condition, value) {
    if (value) {
      this.where.push(condition);
      this.params.push(`%${value}%`);
    }
    return this;
  }

  build(extra = "") {
    let query = this.baseQuery;

    if (this.where.length) {
      query += " AND " + this.where.join(" AND ");
    }

    query += extra;

    return {
      query,
      params: this.params,
    };
  }
}
