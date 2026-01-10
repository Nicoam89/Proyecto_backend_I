router.get("/", async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query } = req.query;

    limit = parseInt(limit);
    page = parseInt(page);

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
      limit,
      page,
      lean: true
    };

    // ordenamiento por precio
    if (sort) {
      options.sort = {
        price: sort === "asc" ? 1 : -1
      };
    }

    const result = await ProductModel.paginate(
      filter,
      options
    );

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
        ? `/api/products?page=${result.prevPage}&limit=${limit}`
        : null,
      nextLink: result.hasNextPage
        ? `/api/products?page=${result.nextPage}&limit=${limit}`
        : null
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message
    });
  }
});
