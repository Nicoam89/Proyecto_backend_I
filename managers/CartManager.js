const fs = require('fs').promises;
const path = require('path');

class CartManager {
  constructor(filename = 'data/carts.json') {
    this.path = path.resolve(filename);
  }

  async _readFile() {
    try {
      const content = await fs.readFile(this.path, 'utf8');
      return JSON.parse(content || '[]');
    } catch (err) {
      if (err.code === 'ENOENT') return [];
      throw err;
    }
  }

  async _writeFile(data) {
    await fs.mkdir(path.dirname(this.path), { recursive: true });
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async _generateId(carts) {
    if (!carts.length) return 1;
    const maxId = carts.reduce((max, c) => Math.max(max, Number(c.id)), 0);
    return maxId + 1;
  }

  async createCart() {
    const carts = await this._readFile();
    const id = await this._generateId(carts);
    const newCart = { id, products: [] };
    carts.push(newCart);
    await this._writeFile(carts);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this._readFile();
    return carts.find(c => String(c.id) === String(id)) || null;
  }

  async addProductToCart(cartId, productId) {
    const carts = await this._readFile();
    const idx = carts.findIndex(c => String(c.id) === String(cartId));
    if (idx === -1) throw new Error('Carrito no existe');
    const cart = carts[idx];

    const prodIdx = cart.products.findIndex(p => String(p.product) === String(productId));
    if (prodIdx === -1) {
      cart.products.push({ product: productId, quantity: 1 });
    } else {
      cart.products[prodIdx].quantity += 1;
    }

    carts[idx] = cart;
    await this._writeFile(carts);
    return cart;
  }
}

module.exports = CartManager;
