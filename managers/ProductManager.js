const fs = require('fs').promises;
const path = require('path');

class ProductManager {
  constructor(filename = 'data/products.json') {
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

  async getProducts() {
    return await this._readFile();
  }

  async getProductById(id) {
    const products = await this._readFile();
    return products.find(p => String(p.id) === String(id)) || null;
  }

  async _generateId(products) {
    if (!products.length) return 1;
    const maxId = products.reduce((max, p) => Math.max(max, Number(p.id)), 0);
    return maxId + 1;
  }

  async addProduct(productData) {
    const required = ['title','description','code','price','status','stock','category'];
    for (const key of required) {
      if (productData[key] === undefined) throw new Error(`Falta campo requerido: ${key}`);
    }
    const products = await this._readFile();
    // evitar duplicar code
    if (products.some(p => p.code === productData.code)) {
      throw new Error('Ya existe un producto con ese code');
    }
    const id = await this._generateId(products);
    const newProduct = {
      id,
      title: String(productData.title),
      description: String(productData.description),
      code: String(productData.code),
      price: Number(productData.price),
      status: Boolean(productData.status),
      stock: Number(productData.stock),
      category: String(productData.category),
      thumbnails: Array.isArray(productData.thumbnails) ? productData.thumbnails : []
    };
    products.push(newProduct);
    await this._writeFile(products);
    return newProduct;
  }

  async updateProduct(id, updateData) {
    const products = await this._readFile();
    const idx = products.findIndex(p => String(p.id) === String(id));
    if (idx === -1) return null;
    // no permitir cambiar id
    delete updateData.id;
    // aplicar cambios
    const updated = { ...products[idx], ...updateData };
    products[idx] = updated;
    await this._writeFile(products);
    return updated;
  }

  async deleteProduct(id) {
    const products = await this._readFile();
    const idx = products.findIndex(p => String(p.id) === String(id));
    if (idx === -1) return false;
    products.splice(idx, 1);
    await this._writeFile(products);
    return true;
  }
}

module.exports = ProductManager;