const express = require('express');
const {
  allProducts,
  deleteProduct,
  newProduct,
  productoById,
  updateProduct
} = require('../../controllers/products.controllers')

const router = express.Router();

router.get('/', allProducts);

router.get('/:idProduct',   productoById);

router.post('/', newProduct);

router.put('/:idProduct', updateProduct);

router.delete('/:idProduct', deleteProduct);

module.exports = router;