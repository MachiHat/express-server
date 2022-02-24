const path = require('path');
const apiRoutes = require('./routers/index');

const { Server: HttpServer } = require('http')
const { Server: Socket } = require('socket.io')

const ContenedorMemoria = require('./contenedores/ContenedorMemoria.js')
const ContenedorArchivo = require('./contenedores/ContenedorArchivo.js')


// SERVER, SOCKET AND API

const express = require("express");
const app = express();
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)
const productosApi = new ContenedorMemoria()
const mensajesApi = new ContenedorArchivo('mensajes.json')

// SOCKET CONFIG

io.on('connection', async socket => {
  console.log('New connection detected: ' + socket.id);
  // -- PRODUCTS --
  // load
  socket.emit('products', productsApi.listarAll());

  // update
  socket.on('update', product => {
      productsApi.guardar(product)
      io.sockets.emit('products', productsApi.listarAll());
  })

  // carga inicial de mensajes
  socket.emit('mensajes', await mensajesApi.listarAll());

  // actualizacion de mensajes
  socket.on('nuevoMensaje', async mensaje => {
      mensaje.fyh = new Date().toLocaleString()
      await mensajesApi.guardar(mensaje)
      io.sockets.emit('mensajes', await mensajesApi.listarAll());
  })
});

// MIDDLEWARES
app.use(express.static(path.resolve(__dirname, './public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use('/api', apiRoutes);

// HANDLEBARS
const { engine } = require("express-handlebars");
app.engine('hbs', engine({
  extname: 'hbs',
  defaultLayout: 'index.hbs'
}));
app.set('views', './views');
app.set('view engine', 'hbs');

// SERVER START
const PORT = process.env.PORT || 8080;
const connectedServer = app.listen(PORT, () => {
  console.log(`SERVER IS LIVE ON PORT: ${[PORT]}`);
});

connectedServer.on("error", (error) => {
  console.log(error.message);
});
