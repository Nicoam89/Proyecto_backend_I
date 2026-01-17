# Proyecto Backend I – Entrega Final

Este proyecto corresponde a la **Entrega Final del curso Backend I**, donde se implementa una API REST para la gestión de **productos y carritos**, utilizando **Node.js, Express, MongoDB y Handlebars**.

En esta re-entrega se corrigió la **estructura del proyecto**, se normalizó el **script de inicio**, y se eliminaron dependencias que no formaban parte de los requerimientos de la consigna (por ejemplo, socket.io).

---

## 🚀 Tecnologías utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- mongoose-paginate-v2
- Express Handlebars

---

## 📁 Estructura del proyecto

```txt
Proyecto_backend_I
├── src
│   ├── config
│   │   └── mongoose.js
│   ├── models
│   │   ├── product.model.js
│   │   └── cart.model.js
│   ├── routes
│   │   ├── products.router.js
│   │   ├── carts.router.js
│   │   └── views.router.js
│   ├── views
│   │   ├── layouts
│   │   │   └── main.handlebars
│   │   ├── index.handlebars
│   │   ├── productDetail.handlebars
│   │   └── cart.handlebars
│   ├── public
│   │   ├── js
│   │   └── css
│   ├── app.js
│   └── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
