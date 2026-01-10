const express = require('express');
const router = express.Router();
const CartManager = require('../../managers/CartManager');
const ProductManager = require('../../managers/ProductManager');

const cm = new CartManager('data/carts.json');
const pm = new ProductManager('data/products.json');

router.post('/', async (req, res) => {
  try {
    const newCart = await cm.createCart();
    res.status(201).json(newCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cart = await cm.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart.products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    // validar que el producto exista
    const product = await pm.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ error: 'Producto no existe' });

    const updatedCart = await cm.addProductToCart(req.params.cid, req.params.pid);
    res.json(updatedCart);
  } catch (err) {
    if (err.message === 'Carrito no existe') return res.status(404).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
