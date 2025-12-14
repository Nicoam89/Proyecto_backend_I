import { httpServer } from './app.js';

const PORT = 8080;
httpServer.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));



const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.json());

// Routers
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
