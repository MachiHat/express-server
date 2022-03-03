const express = require('express')
const productRoutes = require('./routers/index')

const { Server: HttpServer } = require('http')
const { Server: Socket } = require('socket.io')

const PORT = process.env.PORT || 8080
const app = express()
const path = require('path');
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use(express.static(path.resolve(__dirname, './public')));

// Routes
app.use('/', productRoutes)


const connectedServer = app.listen(PORT, ()=>{
    console.log(`Server is up and running on port ${PORT}`)
})

connectedServer.on('error', (error)=>{
    console.log(`An error has ocurred: ${error}`)
})



