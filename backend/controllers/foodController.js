const Food = require('../models/Food');
const initialFoods = require('../seeds/seedFoods');
const store = require('../utils/store');

// Auto seed helper
const autoSeedFoods = async () => {
  if (!global.isMongoConnected) return;
  try {
    const count = await Food.countDocuments();
    if (count === 0) {
      await Food.insertMany(initialFoods);
      console.log('🌱 Food menu auto-seeded into MongoDB Atlas!');
    }
  } catch (error) {
    console.error('Error during auto-seed:', error.message);
  }
};

// @desc    Get all foods with optional category & search filter
// @route   GET /api/foods
// @access  Public
const getFoods = async (req, res) => {
  try {
    const { category, search, vegOnly } = req.query;

    if (global.isMongoConnected) {
      let query = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      if (search && search.trim() !== '') {
        query.$or = [
          { name: { $regex: search.trim(), $options: 'i' } },
          { description: { $regex: search.trim(), $options: 'i' } },
          { category: { $regex: search.trim(), $options: 'i' } },
        ];
      }
      if (vegOnly === 'true') {
        query.isVeg = true;
      }
      const foods = await Food.find(query).sort({ createdAt: -1 });
      return res.json({
        success: true,
        count: foods.length,
        data: foods,
      });
    }

    // Fallback store
    const foods = store.getFoods({ category, search, vegOnly });
    return res.json({
      success: true,
      count: foods.length,
      data: foods,
    });
  } catch (error) {
    console.error('Get Foods Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching food items',
    });
  }
};

// @desc    Get single food item by ID
// @route   GET /api/foods/:id
// @access  Public
const getFoodById = async (req, res) => {
  try {
    if (global.isMongoConnected) {
      const food = await Food.findById(req.params.id);
      if (!food) {
        return res.status(404).json({
          success: false,
          message: 'Food item not found',
        });
      }
      return res.json({ success: true, data: food });
    }

    const food = store.getFoodById(req.params.id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found',
      });
    }
    return res.json({ success: true, data: food });
  } catch (error) {
    console.error('Get Food By ID Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching food item',
    });
  }
};

// @desc    Seed food items
// @route   POST /api/foods/seed
// @access  Public
const seedFoods = async (req, res) => {
  try {
    if (global.isMongoConnected) {
      await Food.deleteMany({});
      const inserted = await Food.insertMany(initialFoods);
      return res.status(201).json({
        success: true,
        message: `Successfully seeded ${inserted.length} food items!`,
        data: inserted,
      });
    }

    const seeded = store.seedFoods();
    return res.status(201).json({
      success: true,
      message: `Successfully seeded ${seeded.length} food items!`,
      data: seeded,
    });
  } catch (error) {
    console.error('Seed Foods Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error seeding food items',
    });
  }
};

module.exports = {
  getFoods,
  getFoodById,
  seedFoods,
  autoSeedFoods,
};
