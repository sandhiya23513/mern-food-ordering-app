const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const initialFoods = require('../seeds/seedFoods');

const DB_FILE = path.join(__dirname, '../data/local_db.json');

// Default initial state
const getInitialData = () => {
  return {
    users: [
      {
        _id: 'usr_student_demo_1',
        name: 'Demo Student',
        email: 'student@college.edu',
        password: '$2b$10$XmedKjPLlS5Sr3EZlhKiHuQFTZh4cJ6pekxoldAap7qbcmdz42VmS', // student123
        role: 'customer',
        phone: '+91 98765 43210',
        address: 'Room 204, Campus Hostel, College Road',
        createdAt: new Date().toISOString(),
      },
      {
        _id: 'usr_john_demo_2',
        name: 'John Doe',
        email: 'user@example.com',
        password: '$2b$10$XmedKjPLlS5Sr3EZlhKiHuQFTZh4cJ6pekxoldAap7qbcmdz42VmS', // student123
        role: 'customer',
        phone: '+91 98111 22334',
        address: '124 Park Avenue, City Center',
        createdAt: new Date().toISOString(),
      },
    ],
    foods: initialFoods.map((f, i) => ({
      _id: `food_${i + 1}`,
      ...f,
      createdAt: new Date().toISOString(),
    })),
    orders: [
      {
        _id: 'ord_sample_101',
        user: 'usr_student_demo_1',
        customerName: 'Demo Student',
        phoneNumber: '+91 98765 43210',
        deliveryAddress: 'Room 204, Campus Hostel, College Road',
        deliveryNotes: 'Please ring bell',
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Pending',
        orderStatus: 'Preparing',
        items: [
          {
            food: 'food_1',
            name: 'Margherita Delight Pizza',
            price: 250,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
          },
          {
            food: 'food_2',
            name: 'Classic Veggie Cheese Burger',
            price: 150,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
          },
        ],
        subtotal: 400,
        deliveryFee: 40,
        tax: 20,
        totalAmount: 460,
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      },
    ],
  };
};

class LocalStore {
  constructor() {
    this.init();
  }

  init() {
    try {
      if (!fs.existsSync(DB_FILE)) {
        const initial = getInitialData();
        fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
        this.data = initial;
      } else {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(content);
        if (!this.data.foods || this.data.foods.length === 0) {
          this.data.foods = getInitialData().foods;
          this.save();
        }
      }
    } catch (err) {
      console.error('Error initializing local store:', err);
      this.data = getInitialData();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2));
    } catch (err) {
      console.error('Error saving local store:', err);
    }
  }

  // Users
  findUserByEmail(email) {
    if (!email) return null;
    return this.data.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );
  }

  findUserById(id) {
    return this.data.users.find((u) => u._id === id || u.id === id);
  }

  async createUser({ name, email, password, phone, address }) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      _id: 'usr_' + Date.now() + Math.random().toString(36).substr(2, 4),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'customer',
      phone: phone || '',
      address: address || '',
      createdAt: new Date().toISOString(),
    };

    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  // Foods
  getFoods({ category, search, vegOnly }) {
    let result = [...this.data.foods];

    if (category && category !== 'All') {
      result = result.filter(
        (f) => f.category && f.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q)
      );
    }

    if (vegOnly === 'true' || vegOnly === true) {
      result = result.filter((f) => f.isVeg);
    }

    return result;
  }

  getFoodById(id) {
    return this.data.foods.find((f) => f._id === id || f.id === id);
  }

  seedFoods() {
    const initial = getInitialData();
    this.data.foods = initial.foods;
    this.save();
    return this.data.foods;
  }

  // Orders
  createOrder(orderData) {
    const newOrder = {
      _id: 'ord_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      user: orderData.user,
      customerName: orderData.customerName,
      phoneNumber: orderData.phoneNumber,
      deliveryAddress: orderData.deliveryAddress,
      deliveryNotes: orderData.deliveryNotes || '',
      paymentMethod: orderData.paymentMethod || 'Cash on Delivery',
      paymentStatus:
        orderData.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Completed',
      orderStatus: 'Placed',
      items: orderData.items,
      subtotal: orderData.subtotal,
      deliveryFee: orderData.deliveryFee,
      tax: orderData.tax,
      totalAmount: orderData.totalAmount,
      createdAt: new Date().toISOString(),
    };

    this.data.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  getOrdersByUser(userId) {
    return this.data.orders.filter(
      (o) => o.user.toString() === userId.toString()
    );
  }

  getOrderById(id) {
    return this.data.orders.find((o) => o._id === id || o.id === id);
  }

  updateOrderStatus(orderId, status) {
    const order = this.getOrderById(orderId);
    if (!order) return null;
    order.orderStatus = status;
    if (status === 'Delivered') {
      order.paymentStatus = 'Completed';
    }
    this.save();
    return order;
  }
}

const store = new LocalStore();
module.exports = store;
