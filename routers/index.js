const express = require('express')

const productRoutes = require('./products/products.routes')

const router = express.Router()

// Routes
router.use('/productos', productRoutes)


module.exports = router