const socket = io();
const productList = document.getElementById('productList');
const form = document.getElementById('addProductForm');

form.addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const price = document.getElementById('price').value;
  const newProduct = { id: Date.now(), title, price };
  
  socket.emit('newProduct', newProduct);
  form.reset();
});

// Escucha cuando se agrega un producto
socket.on('productAdded', product => {
  const li = document.createElement('li');
  li.dataset.id = product.id;
  li.innerHTML = `${product.title} - $${product.price} <button class="deleteBtn">Eliminar</button>`;
  productList.appendChild(li);
});

// Eliminar producto
productList.addEventListener('click', e => {
  if (e.target.classList.contains('deleteBtn')) {
    const li = e.target.closest('li');
    const id = li.dataset.id;
    socket.emit('deleteProduct', id);
  }
});

// Escucha cuando se elimina un producto
socket.on('productDeleted', id => {
  const li = document.querySelector(`li[data-id="${id}"]`);
  if (li) li.remove();
});
