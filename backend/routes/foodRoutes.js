const express = require('express');
const router = express.Router();
const {
  getFoods,
  getFoodById,
  seedFoods,
} = require('../controllers/foodController');

router.get('/', getFoods);
router.post('/seed', seedFoods);
router.get('/:id', getFoodById);

module.exports = router;
