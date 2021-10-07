class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //BUILD THE QUERY
    //1A)  FILTERING
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // console.log(req.query, queryObj);

    //1B) ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    //regular expression
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log('replace with $');
    console.log(JSON.parse(queryStr));

    //Tour.find return a query
    this.query = this.query.find(JSON.parse(queryStr));
    //for having access when chaining the methods
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      console.log(this.queryString);
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      //projecting
      // query = query.select(`name duration price`)
      this.query = this.query.select(fields);
    } else {
      //we can remove a field
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    //?page=2&limit=10, 1-10, 11-20, 21-30
    this.query = this.query.skip(skip).limit(limit);

    // if (this.queryString.page) {
    //   //return a promise with the number of the documents
    //   const numTours = await Tour.countDocuments();
    //   console.log('There are no results for the requested page');
    //   if (skip >= numTours) throw new Error('This page does not exist!');
    // }

    return this;
  }
}

module.exports = APIFeatures;
