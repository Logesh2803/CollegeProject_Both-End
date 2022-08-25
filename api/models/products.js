const { KingBedOutlined } = require("@material-ui/icons");
const joi = require("joi");

const product = joi.object({
  title: joi.string().min(3).max(20).required(),
  description: joi.string().min(5).max(50).required(),
  price: joi.number().required(),
  image: joi.string(),
  colors: joi.array(),
  sizes: joi.array(),
});

module.exports = product;
