/**
 * Router de Vistas
 * Maneja las rutas que renderizan vistas HTML usando Handlebars
 * Combina datos de archivos JSON y MongoDB para mostrar en el frontend
 */

// Importar Router de Express usando sintaxis ES6
import { Router } from 'express';

// Importar módulo de sistema de archivos para leer/escribir archivos
import fs from 'fs';

// Importar módulo para manejar rutas de archivos y directorios
import path from 'path';

// Importar utilidad para convertir URL de módulos ES6 a rutas de archivos
import { fileURLToPath } from 'url';

// Crear instancia del router
const router = Router();

/**
 * Configuración de rutas de archivos para ES6 modules
 * En ES6 modules, __filename y __dirname no existen por defecto
 * por lo que debemos crearlos manualmente
 */

// Obtener la ruta completa del archivo actual
const __filename = fileURLToPath(import.meta.url);

// Obtener el directorio del archivo actual
const __dirname = path.dirname(__filename);

// Construir la ruta al archivo products.json
// path.join une las partes de la ruta de forma compatible con el sistema operativo
const productsPath = path.join(__dirname, '../data/products.json');

/**
 * Función auxiliar para leer productos del archivo JSON
 * Lee el archivo products.json y retorna un array de productos
 * @returns {Array} Array de productos o array vacío si el archivo no existe
 */
const getProducts = () => {
    // Verificar si el archivo existe antes de intentar leerlo
    if (!fs.existsSync(productsPath)) return [];
    
    // Leer el contenido del archivo como texto UTF-8
    const data = fs.readFileSync(productsPath, 'utf-8');
    
    // Convertir el texto JSON a un objeto JavaScript
    return JSON.parse(data);
};

/**
 * GET /
 * Ruta principal - Renderiza la vista 'home' con lista de productos
 * Lee los productos desde el archivo JSON (sistema de archivos)
 * @returns {HTML} Vista home.handlebars con la lista de productos
 */
router.get('/', (req, res) => {
    // Obtener todos los productos del archivo JSON
    const products = getProducts();
    
    // Renderizar la vista 'home' pasando los productos como contexto
    // Handlebars podrá acceder a 'products' en la plantilla
    res.render('home', { products });
});

/**
 * GET /carts/:cid
 * Renderiza la vista del carrito con los productos que contiene
 * Utiliza MongoDB (Mongoose) para obtener los datos del carrito
 * @param {string} cid - ID del carrito (MongoDB ObjectId)
 * @returns {HTML} Vista cart.handlebars con los productos del carrito
 * 
 * NOTA: Esta ruta usa CartModel que debería estar importado al inicio del archivo
 */
router.get("/carts/:cid", async (req, res) => {
    // Buscar el carrito por ID en MongoDB
    const cart = await CartModel
        .findById(req.params.cid) // Buscar por el ID del carrito
        .populate("products.product") // Popular los datos completos de cada producto
        .lean(); // Convertir a objeto JavaScript plano (necesario para Handlebars)
    
    // Renderizar la vista 'cart' pasando solo el array de productos
    // Handlebars podrá iterar sobre cart.products en la plantilla
    res.render("cart", { products: cart.products });
});

// Exportar el router usando sintaxis ES6
export default router;