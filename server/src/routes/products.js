const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  togglePublishStatus
} = require('../controllers/products');

const { protect, authorize } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validators');

const router = express.Router();

// Public routes
router.get('/', getProducts);

router.use(protect);

router.get('/user/my-products', getMyProducts);
router.post('/', validateProduct, createProduct);
router.put('/:id', validateProduct, updateProduct);
router.delete('/:id', deleteProduct);
router.put('/:id/publish', togglePublishStatus);
router.get('/:id', getProduct);

module.exports = router;
