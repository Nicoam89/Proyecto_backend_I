/**
 * Rutas para la gestión de productos
 * Endpoints: GET, POST, PUT, DELETE
 */

import { Router } from "express";
import ProductModel from "../models/product.model.js";

/**
 * GET /api/products
 * Obtiene todos los productos con paginación
 * Query params: limit, page, sort, query
 */

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = {};

    // filtro por categoría o disponibilidad
    if (query) {
      if (query === "true" || query === "false") {
        filter.status = query === "true";
      } else {
        filter.category = query;
      }
    }

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      lean: true
    };

    // ordenamiento por precio
    if (sort) {
      options.sort = { price: sort === "asc" ? 1 : -1 };
    }

    const result = await ProductModel.paginate(filter, options);

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/api/products?page=${result.prevPage}`
        : null,
      nextLink: result.hasNextPage
        ? `/api/products?page=${result.nextPage}`
        : null
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

export default router;
