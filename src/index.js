import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  status: {
    type: Boolean,
    default: true
  },
  stock: Number,
  thumbnail: String
});

productSchema.plugin(paginate);

export const ProductModel = mongoose.model(
  "products",
  productSchema
);
