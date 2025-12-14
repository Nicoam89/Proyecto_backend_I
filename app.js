import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import { createServer } from 'http';
import viewsRouter from './routes/views.router.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// Rutas
app.use('/', viewsRouter);

// Socket.io
io.on('connection', (socket) => {
    console.log('🟢 Nuevo cliente conectado');

    socket.on('newProduct', (product) => {
        io.emit('productAdded', product);
    });

    socket.on('deleteProduct', (id) => {
        io.emit('productDeleted', id);
    });
});

export { httpServer };
