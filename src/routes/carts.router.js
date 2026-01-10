router.get("/:cid", async (req, res) => {
  const { cid } = req.params;

  const cart = await CartModel
    .findById(cid)
    .populate("products.product");

  if (!cart) {
    return res.status(404).json({
      status: "error",
      error: "Carrito no encontrado"
    });
  }

  res.json({
    status: "success",
    payload: cart
  });
});


router.get("/:cid", async (req, res) => {
  const { cid } = req.params;

  const cart = await CartModel
    .findById(cid)
    .populate("products.product");

  res.json({
    status: "success",
    payload: cart
  });
});


router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  await CartModel.updateOne(
    { _id: cid, "products.product": pid },
    { $set: { "products.$.quantity": quantity } }
  );

  res.json({
    status: "success",
    message: "Cantidad actualizada"
  });
});


router.delete("/:cid", async (req, res) => {
  await CartModel.updateOne(
    { _id: req.params.cid },
    { $set: { products: [] } }
  );

  res.json({
    status: "success",
    message: "Carrito vacío"
  });
});
