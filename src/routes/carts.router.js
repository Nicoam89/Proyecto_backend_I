/**
 * Router de Carritos con Mongoose
 * Maneja todas las rutas relacionadas con la gestión de carritos usando MongoDB
 * Rutas base: /api/carts
 */

// Importar Router de Express usando sintaxis ES6
import { Router } from "express";

// Crear instancia del router
const router = Router();

/**
 * GET /api/carts/:cid
 * Obtiene un carrito por su ID con los productos populados
 * @param {string} cid - ID del carrito (MongoDB ObjectId)
 * @returns {Object} 200 - Carrito encontrado con productos completos
 * @returns {Object} 404 - Carrito no encontrado
 */
router.get("/:cid", async (req, res) => {
  // Extraer el ID del carrito de los parámetros de la URL
  const { cid } = req.params;
  
  // Buscar el carrito por ID y popular los datos completos de los productos
  // populate() reemplaza las referencias de productos con los documentos completos
  const cart = await CartModel
    .findById(cid)
    .populate("products.product");
  
  // Validar si el carrito existe
  if (!cart) {
    return res.status(404).json({
      status: "error",
      error: "Carrito no encontrado"
    });
  }
  
  // Retornar el carrito encontrado
  res.json({
    status: "success",
    payload: cart
  });
});

/**
 * GET /api/carts/:cid (duplicado)
 * NOTA: Esta ruta es idéntica a la anterior y nunca se ejecutará
 * debido a que Express usa la primera coincidencia de ruta
 * @param {string} cid - ID del carrito
 * @returns {Object} 200 - Carrito con productos populados
 */
router.get("/:cid", async (req, res) => {
  // Extraer el ID del carrito de los parámetros
  const { cid } = req.params;
  
  // Buscar carrito y popular productos
  const cart = await CartModel
    .findById(cid)
    .populate("products.product");
  
  // Retornar carrito (sin validación de existencia)
  res.json({
    status: "success",
    payload: cart
  });
});

/**
 * PUT /api/carts/:cid/products/:pid
 * Actualiza la cantidad de un producto específico dentro del carrito
 * @param {string} cid - ID del carrito
 * @param {string} pid - ID del producto a actualizar
 * @param {number} quantity - Nueva cantidad del producto (desde req.body)
 * @returns {Object} 200 - Confirmación de actualización exitosa
 */
router.put("/:cid/products/:pid", async (req, res) => {
  // Extraer IDs del carrito y producto de los parámetros
  const { cid, pid } = req.params;
  
  // Extraer la nueva cantidad del body de la petición
  const { quantity } = req.body;
  
  // Actualizar la cantidad del producto en el carrito
  // $set actualiza solo el campo quantity del producto que coincide
  // products.$ es el operador posicional que hace referencia al elemento encontrado
  await CartModel.updateOne(
    { _id: cid, "products.product": pid }, // Filtro: busca el carrito y el producto específico
    { $set: { "products.$.quantity": quantity } } // Actualización: modifica solo la cantidad
  );
  
  // Confirmar la actualización
  res.json({
    status: "success",
    message: "Cantidad actualizada"
  });
});

/**
 * DELETE /api/carts/:cid
 * Vacía completamente el carrito eliminando todos los productos
 * @param {string} cid - ID del carrito a vaciar
 * @returns {Object} 200 - Confirmación de carrito vaciado
 */
router.delete("/:cid", async (req, res) => {
  // Actualizar el carrito estableciendo el array de productos como vacío
  // $set reemplaza el array completo por uno vacío
  await CartModel.updateOne(
    { _id: req.params.cid }, // Filtro: buscar por ID de carrito
    { $set: { products: [] } } // Actualización: vaciar array de productos
  );
  
  // Confirmar que el carrito fue vaciado
  res.json({
    status: "success",
    message: "Carrito vacío"
  });
});

// Exportar el router usando sintaxis ES6
export default router;