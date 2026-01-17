/**
 * Router de Productos
 * Maneja todas las rutas CRUD (Create, Read, Update, Delete) para productos
 * Rutas base: /api/products
 */

// Importar Express y crear el router
const express = require('express');
const router = express.Router();

// Importar el gestor de productos
const ProductManager = require('../managers/ProductManager');

// Crear instancia del ProductManager con la ruta al archivo JSON
const pm = new ProductManager('data/products.json');

/**
 * GET /api/products
 * Obtiene la lista completa de productos
 * @returns {Array} 200 - Lista de todos los productos
 * @returns {Object} 500 - Error del servidor
 */
router.get('/', async (req, res) => {
  try {
    // Obtener todos los productos del archivo JSON
    const products = await pm.getProducts();
    
    // Retornar la lista de productos
    res.json(products);
  } catch (err) {
    // Manejar errores del servidor
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/products/:pid
 * Obtiene un producto específico por su ID
 * @param {string} pid - ID del producto a buscar
 * @returns {Object} 200 - Producto encontrado
 * @returns {Object} 404 - Producto no encontrado
 * @returns {Object} 500 - Error del servidor
 */
router.get('/:pid', async (req, res) => {
  try {
    // Buscar el producto por su ID
    const p = await pm.getProductById(req.params.pid);
    
    // Validar si el producto existe
    if (!p) return res.status(404).json({ error: 'Producto no encontrado' });
    
    // Retornar el producto encontrado
    res.json(p);
  } catch (err) {
    // Manejar errores del servidor
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/products
 * Crea un nuevo producto
 * @param {Object} req.body - Datos del producto a crear (title, price, stock, etc.)
 * @returns {Object} 201 - Producto creado exitosamente
 * @returns {Object} 400 - Error de validación en los datos enviados
 */
router.post('/', async (req, res) => {
  try {
    // Crear un nuevo producto con los datos del body
    const newP = await pm.addProduct(req.body);
    
    // Retornar el producto creado con código 201 (Created)
    res.status(201).json(newP);
  } catch (err) {
    // Manejar errores de validación con código 400 (Bad Request)
    res.status(400).json({ error: err.message });
  }
});

/**
 * PUT /api/products/:pid
 * Actualiza un producto existente
 * @param {string} pid - ID del producto a actualizar
 * @param {Object} req.body - Datos a actualizar del producto
 * @returns {Object} 200 - Producto actualizado exitosamente
 * @returns {Object} 404 - Producto no encontrado
 * @returns {Object} 400 - Error de validación
 */
router.put('/:pid', async (req, res) => {
  try {
    // Actualizar el producto con los nuevos datos
    const updated = await pm.updateProduct(req.params.pid, req.body);
    
    // Validar si el producto existe
    if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
    
    // Retornar el producto actualizado
    res.json(updated);
  } catch (err) {
    // Manejar errores de validación
    res.status(400).json({ error: err.message });
  }
});

/**
 * DELETE /api/products/:pid
 * Elimina un producto por su ID
 * @param {string} pid - ID del producto a eliminar
 * @returns {Object} 200 - Confirmación de eliminación exitosa
 * @returns {Object} 404 - Producto no encontrado
 * @returns {Object} 500 - Error del servidor
 */
router.delete('/:pid', async (req, res) => {
  try {
    // Intentar eliminar el producto
    const ok = await pm.deleteProduct(req.params.pid);
    
    // Validar si el producto existía y fue eliminado
    if (!ok) return res.status(404).json({ error: 'Producto no encontrado' });
    
    // Confirmar la eliminación
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    // Manejar errores del servidor
    res.status(500).json({ error: err.message });
  }
});

// Exportar el router para usarlo en app.js
module.exports = router;

/**
 * GET /products
 * Ruta para renderizar la vista de productos con paginación
 * Utiliza Mongoose para consultar la base de datos
 * @param {number} page - Número de página (query param, por defecto 1)
 * @returns {HTML} Vista renderizada con lista de productos paginados
 * 
 * NOTA: Esta ruta usa sintaxis ES6 (export) mientras que el resto usa CommonJS (module.exports)
 * Esto causará un error. Deberías usar una sintaxis consistente en todo el archivo.
 */
router.get("/products", async (req, res) => {
  // Consultar productos con paginación usando Mongoose
  // lean: true convierte los documentos de Mongoose a objetos JavaScript planos
  const result = await ProductModel.paginate(
    {}, // Filtro vacío (trae todos los productos)
    { 
      limit: 10, // Máximo 10 productos por página
      page: req.query.page || 1, // Número de página desde query string, por defecto 1
      lean: true // Retorna objetos planos en lugar de documentos Mongoose
    }
  );
  
  // Renderizar la vista 'index' pasando los datos paginados
  res.render("index", result);
});

// Exportar usando sintaxis ES6
// ⚠️ CONFLICTO: No puedes usar 'export default' y 'module.exports' en el mismo archivo
export default router;