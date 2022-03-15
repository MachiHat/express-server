const express = require('express')
const http = require('http')
const socketIo = require('socket.io');
const config = require('./db/config.js');

// const contenedorProducto = require('./contenedores/productos/contenedorProductos')
// const contenedorMensaje = require('./contenedores/chat/contenedorChat')
const contenedorSQL = require('./contenedores/ContenedorSQL');

//Instancia servidor, socket y api

const app = express()
const serverHttp = http.createServer(app)
const io = socketIo(serverHttp)

// const productosApi = new contenedorProducto()
// const mensajesApi = new contenedorMensaje()

const productosApi = new contenedorSQL(config.mariaDb, 'productos');
const mensajesApi = new contenedorSQL(config.sqlite3, 'mensajes');

//-------------------

//Middleware

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//--------------------

//Configuración socket

io.on('connection', async (socket) => {
    console.log('Se conecto un nuevo cliente: ', socket.id)

    //Carga inicial productos

    socket.emit('getProductos', await productosApi.getAll())


    //alta de producto

    socket.on('createProducto', (data) => {
        productosApi.save(data)
            .then((nuevoId) => {
                console.log('Se generó el id: ', nuevoId)
            })
            .then(async () => { io.sockets.emit('getProductos', await productosApi.getAll()) })
    });

    // carga inicial de mensajes

    const mensa = await mensajesApi.getAll()

    console.log(mensa)

    socket.emit('getMensajes', await mensajesApi.getAll());

    // actualizacion de mensajes
    socket.on('createMensaje', (data) => {
        data.fyh = new Date().toLocaleString()
        mensajesApi.save(data)
            .then((nuevoId) => {
                console.log('Se generó el id mensaje: ', nuevoId)
            })
            .then(async () => { io.sockets.emit('getMensajes', await mensajesApi.getAll()) })
    });


})

//-------------------

//Inicio servidor

const PORT = process.env.PORT || 8080

serverHttp.listen(PORT, () => {
    console.log("Server is up and running on port ", PORT)
})

serverHttp.on('error', (error) => { console.log(error.message) })
//-------------------


