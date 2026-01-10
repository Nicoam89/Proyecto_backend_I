import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsPath = path.join(__dirname, '../data/products.json');

// Función para leer productos
const getProducts = () => {
    if (!fs.existsSync(productsPath)) return [];
    const data = fs.readFileSync(productsPath, 'utf-8');
    return JSON.parse(data);
};

// Home - lista estática
router.get('/', (req, res) => {
    const products = getProducts();
    res.render('home', { products });
});

// Real-time view
router.get('/realtimeproducts', (req, res) => {
    const products = getProducts();
    res.render('realTimeProducts', { products });
});

export default router;


router.get("/carts/:cid", async (req, res) => {
  const cart = await CartModel
    .findById(req.params.cid)
    .populate("products.product")
    .lean();

  res.render("cart", { products: cart.products });
});
