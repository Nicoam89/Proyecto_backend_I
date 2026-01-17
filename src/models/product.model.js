/**
 * Modelo de Producto
 * Define el esquema y validaciones para productos en MongoDB
 */

import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


// Definición del esquema de producto

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  status: Boolean
});

// Plugin para paginación

productSchema.plugin(mongoosePaginate);

// Crear modelo a partir del esquema

const ProductModel = mongoose.model("products", productSchema);

export default ProductModel;
