const fs = require('fs')

class contenedorChat {

    constructor() {
        this.ruta = 'models/chat/mensajes.txt'
    }

    save = async (mensaje) => {
        try {
            const contenido = await fs.promises.readFile(this.ruta, 'utf-8')

            const mensajes = JSON.parse(contenido)

            let ultimoId = await this.obtenerUltimoId()

            mensaje.id = ultimoId;

            mensajes.push(mensaje);

            await fs.promises.writeFile(this.ruta, JSON.stringify(mensajes, null, 2))

            this.actualizarUltimoId()

            return mensaje.id

        }
        catch (err) {
            console.log(`Se produjo un error: ${err}`)
        }
    }

    getById = async (id) => {

        try {

            const contenido = await fs.promises.readFile(this.ruta, 'utf-8')

            const mensajes = JSON.parse(contenido)

            const mensajeBuscado = mensajes.find(prod => prod.id == id)

            return mensajeBuscado
        }
        catch (err) {
            console.log(`Se produjo un error: ${err}`)
        }
    }

    getAll = async () => {

        try {
            const contenido = await fs.promises.readFile(this.ruta, 'utf-8')

            const mensajes = JSON.parse(contenido)

            return mensajes

        }
        catch (err) {
            console.log(`Se produjo un error: ${err}`)
        }
    }

    deleteById = async (id) => {

        try {
            const contenido = await fs.promises.readFile(this.ruta, 'utf-8')

            const productos = JSON.parse(contenido)

            const productosFiltrados = productos.filter(prod => prod.id != id)

            await fs.promises.writeFile(this.ruta, JSON.stringify(productosFiltrados, null, 2))
        }
        catch (err) {
            console.log(`Se produjo un error: ${err}`)
        }
    }

    deleteAll = async () => {

        try {
            let productos = []

            await fs.promises.writeFile(this.ruta, JSON.stringify(productos, null, 2))
                .then(() => {
                    console.log("Se borran los elementos")
                })
        }

        catch (err) {
            console.log(err)
        }

    }


    obtenerUltimoId = async () => {
        const contenido = fs.promises.readFile('models/chat/ultimoId.txt', 'utf-8')

        return contenido
    }

    actualizarUltimoId = async () => {

        let nuevoId = 0

        this.obtenerUltimoId().then(
            (resultado) => {

                nuevoId = Number(resultado) + 1

                fs.promises.writeFile('models/chat/ultimoId.txt', nuevoId.toString())
            })
    }
}

module.exports = contenedorChat