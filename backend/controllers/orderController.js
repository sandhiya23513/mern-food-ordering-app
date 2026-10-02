const Order = require('../models/Order');
const store = require('../utils/store');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      items,
      customerName,
      deliveryAddress,
      phoneNumber,
      deliveryNotes,
      paymentMethod,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in order',
      });
    }

    if (!customerName || !deliveryAddress || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide recipient name, delivery address, and phone number',
      });
    }

    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );

    const deliveryFee = subtotal >= 500 ? 0 : 40;
    const tax = Math.round(subtotal * 0.05);
    const totalAmount = subtotal + deliveryFee + tax;

    const orderPayload = {
      user: req.user._id,
      items: items.map((item) => ({
        food: item.food || item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      customerName,
      deliveryAddress,
      phoneNumber,
      deliveryNotes: deliveryNotes || '',
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus:
        paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Completed',
      orderStatus: 'Placed',
      subtotal,
      deliveryFee,
      tax,
      totalAmount,
    };

    if (global.isMongoConnected) {
      const order = new Order(orderPayload);
      const savedOrder = await order.save();
      return res.status(201).json({
        success: true,
        message: 'Order placed successfully!',
        order: savedOrder,
      });
    }

    // Fallback store
    const savedOrder = store.createOrder(orderPayload);
    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: savedOrder,
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error processing your order',
    });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    if (global.isMongoConnected) {
      const orders = await Order.find({ user: req.user._id }).sort({
        createdAt: -1,
      });
      return res.json({
        success: true,
        count: orders.length,
        orders,
      });
    }

    const orders = store.getOrdersByUser(req.user._id);
    return res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error('Get My Orders Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching order history',
    });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    if (global.isMongoConnected) {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      return res.json({ success: true, order });
    }

    const order = store.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    return res.json({ success: true, order });
  } catch (error) {
    console.error('Get Order By ID Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching order details',
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    if (global.isMongoConnected) {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      order.orderStatus = status;
      if (status === 'Delivered') {
        order.paymentStatus = 'Completed';
      }
      const updatedOrder = await order.save();
      return res.json({
        success: true,
        message: `Order status updated to ${status}`,
        order: updatedOrder,
      });
    }

    const updatedOrder = store.updateOrderStatus(req.params.id, status);
    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    return res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Update Order Status Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating order status',
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
};
