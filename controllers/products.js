const Products = require("../db/model");
const operatorMap = {
  ">": "gt",
  "<": "lt",
  ">=": "gte",
  "<=": "lte",
  "=": "eq",
};
const operatorRegex = /\b(<|>|<=|>=|=)\b/g;
const numericFilterOptions = ["price", "rating"];

const getAllProducts = async (req, res) => {
  const { name, company, featured, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (name) queryObject.name = { $regex: name, $options: "i" };
  if (company) queryObject.company = company;
  if (featured) queryObject.featured = featured;
  if (numericFilters) {
    let filters = numericFilters.replace(
      operatorRegex,
      (match) => `-$${operatorMap[match]}-`
    );
    filters.split(",").forEach((element) => {
      const [field, op, value] = element.split("-");
      if (numericFilterOptions.includes(field)) {
        queryObject[field] = { [op]: Number(value) };
      }
    });
  }
  let results = Products.find(queryObject);
  if (sort) {
    const sortString = sort.split(",").join(" ");
    results = results.sort(sortString);
  }
  if (fields) {
    const selectString = fields.split(",").join(" ");
    results = results.select(selectString);
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  results = results.skip(skip).limit(limit);

  const products = await results;
  res.status(200).json({ nbHits: products.length, products });
};

module.exports = getAllProducts;
