const express = require('express')
// const apiRoutes = require('./routers/index')
// const path = require('path')
const http = require('http')
const socketIo = require('socket.io');

const contenedorProducto = require('./models/productos/contenedorProductos')
const contenedorMensaje = require('./models/chat/contenedorChat')


//Instancia servidor, socket y api

const app = express()
const serverHttp = http.createServer(app)
const io = socketIo(serverHttp)

const productosApi = new contenedorProducto()
const mensajesApi = new contenedorMensaje()

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
    console.log("Server is up and runnion on port ", PORT)
})

serverHttp.on('error', (error) => { console.log(error.message) })
//-------------------


