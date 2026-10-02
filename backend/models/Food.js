const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide food name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide food description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide food price in INR'],
      min: 0,
    },
    image: {
      type: String,
      required: [true, 'Please provide image URL'],
    },
    category: {
      type: String,
      required: [true, 'Please provide food category'],
      enum: ['Pizza', 'Burger', 'Biryani', 'Pasta', 'Sandwich', 'Snacks', 'Desserts', 'Beverages'],
      default: 'Pizza',
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    isVeg: {
      type: Boolean,
      default: true,
    },
    preparationTime: {
      type: String,
      default: '20-30 mins',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Food', foodSchema);
