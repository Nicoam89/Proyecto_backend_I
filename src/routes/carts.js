/**
 * Router de Carritos
 * Maneja todas las rutas relacionadas con la gestión de carritos de compra
 * Rutas base: /api/carts
 */

// Importar Express y crear el router
const express = require('express');
const router = express.Router();

// Importar los managers para gestionar carritos y productos
const CartManager = require('../../managers/CartManager');
const ProductManager = require('../../managers/ProductManager');

// Crear instancias de los managers con las rutas a los archivos JSON
const cm = new CartManager('data/carts.json');
const pm = new ProductManager('data/products.json');

/**
 * POST /api/carts
 * Crea un nuevo carrito vacío
 * @returns {Object} 201 - Carrito creado exitosamente
 * @returns {Object} 500 - Error del servidor
 */
router.post('/', async (req, res) => {
  try {
    // Crear un nuevo carrito vacío
    const newCart = await cm.createCart();
    
    // Responder con código 201 (Created) y el carrito creado
    res.status(201).json(newCart);
  } catch (err) {
    // Manejar errores del servidor
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/carts/:cid
 * Obtiene los productos de un carrito específico
 * @param {string} cid - ID del carrito
 * @returns {Array} 200 - Lista de productos en el carrito
 * @returns {Object} 404 - Carrito no encontrado
 * @returns {Object} 500 - Error del servidor
 */
router.get('/:cid', async (req, res) => {
  try {
    // Buscar el carrito por su ID
    const cart = await cm.getCartById(req.params.cid);
    
    // Validar si el carrito existe
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    
    // Retornar solo el array de productos del carrito
    res.json(cart.products);
  } catch (err) {
    // Manejar errores del servidor
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/carts/:cid/product/:pid
 * Agrega un producto al carrito o incrementa su cantidad si ya existe
 * @param {string} cid - ID del carrito
 * @param {string} pid - ID del producto a agregar
 * @returns {Object} 200 - Carrito actualizado
 * @returns {Object} 404 - Carrito o producto no encontrado
 * @returns {Object} 500 - Error del servidor
 */
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    // Validar que el producto exista antes de agregarlo al carrito
    const product = await pm.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ error: 'Producto no existe' });
    
    // Agregar el producto al carrito (o incrementar cantidad si ya existe)
    const updatedCart = await cm.addProductToCart(req.params.cid, req.params.pid);
    
    // Retornar el carrito actualizado
    res.json(updatedCart);
  } catch (err) {
    // Manejar error específico de carrito no encontrado
    if (err.message === 'Carrito no existe') return res.status(404).json({ error: err.message });
    
    // Manejar otros errores del servidor
    res.status(500).json({ error: err.message });
  }
});

// Exportar el router para usarlo en app.js
module.exports = router;