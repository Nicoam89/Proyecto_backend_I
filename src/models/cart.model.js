/**
 * Modelo de Carrito
 * Define el esquema para carritos de compra en MongoDB
 */

import mongoose from "mongoose";

// Sub-esquema para productos dentro del carrito

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
});


// Crear modelo

export const CartModel = mongoose.model(
  "carts",
  cartSchema
);
