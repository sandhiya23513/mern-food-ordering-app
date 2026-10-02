import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import {
  Clock,
  Package,
  Calendar,
  MapPin,
  Phone,
  CheckCircle,
  Truck,
  ChefHat,
  ShoppingBag,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await API.get('/orders/my-orders');
      if (res.data?.orders) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch order history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Status progression simulation for college demo!
  const getNextStatus = (current) => {
    switch (current) {
      case 'Placed':
        return 'Preparing';
      case 'Preparing':
        return 'Out for Delivery';
      case 'Out for Delivery':
        return 'Delivered';
      default:
        return null;
    }
  };

  const handleSimulateStatus = async (orderId, currentStatus) => {
    const nextStatus = getNextStatus(currentStatus);
    if (!nextStatus) return;

    setUpdatingId(orderId);
    try {
      await API.put(`/orders/${orderId}/status`, { status: nextStatus });
      await fetchOrders();
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="loader-container page-padding">
        <div className="spinner"></div>
        <p>Retrieving your order records from MongoDB...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="order-history-empty page-padding">
        <div className="empty-cart-card">
          <div className="empty-cart-icon-wrapper">
            <Package size={56} className="empty-bag-icon" />
          </div>
          <h2>No Previous Orders Found</h2>
          <p>
            You have not placed any orders yet. Try ordering a delicious Pizza, Burger, or Biryani today!
          </p>
          <Link to="/menu" className="btn-primary empty-cart-btn">
            Browse Menu & Order Now <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <div className="order-history-header">
        <div>
          <h1 className="page-title">Order History</h1>
          <p className="page-subtitle">
            Track and review your previous <strong>{orders.length}</strong> orders stored in MongoDB
          </p>
        </div>
        <button className="btn-secondary refresh-btn" onClick={fetchOrders}>
          <RefreshCw size={16} /> Refresh Orders
        </button>
      </div>

      <div className="orders-list">
        {orders.map((order) => {
          const nextStatus = getNextStatus(order.orderStatus);

          return (
            <div key={order._id} className="order-history-card">
              {/* Card Header */}
              <div className="order-card-header">
                <div className="order-header-left">
                  <span className="order-id-label">Order #</span>
                  <span className="order-id-text">{order._id}</span>
                </div>
                <div className="order-header-right">
                  <div className="order-date">
                    <Calendar size={14} />
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  <span className={`status-pill status-${order.orderStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Status Visual Tracker */}
              <div className="status-tracker">
                <div className={`step-node ${['Placed', 'Preparing', 'Out for Delivery', 'Delivered'].includes(order.orderStatus) ? 'completed' : ''}`}>
                  <div className="step-circle"><Package size={14} /></div>
                  <span className="step-text">Placed</span>
                </div>
                <div className={`step-line ${['Preparing', 'Out for Delivery', 'Delivered'].includes(order.orderStatus) ? 'active' : ''}`}></div>

                <div className={`step-node ${['Preparing', 'Out for Delivery', 'Delivered'].includes(order.orderStatus) ? 'completed' : ''}`}>
                  <div className="step-circle"><ChefHat size={14} /></div>
                  <span className="step-text">Preparing</span>
                </div>
                <div className={`step-line ${['Out for Delivery', 'Delivered'].includes(order.orderStatus) ? 'active' : ''}`}></div>

                <div className={`step-node ${['Out for Delivery', 'Delivered'].includes(order.orderStatus) ? 'completed' : ''}`}>
                  <div className="step-circle"><Truck size={14} /></div>
                  <span className="step-text">Out for Delivery</span>
                </div>
                <div className={`step-line ${['Delivered'].includes(order.orderStatus) ? 'active' : ''}`}></div>

                <div className={`step-node ${order.orderStatus === 'Delivered' ? 'completed' : ''}`}>
                  <div className="step-circle"><CheckCircle size={14} /></div>
                  <span className="step-text">Delivered</span>
                </div>
              </div>

              {/* Items in Order */}
              <div className="order-items-grid">
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item-chip">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="order-item-thumb"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80';
                        }}
                      />
                    )}
                    <div className="order-item-info">
                      <span className="order-item-name">{item.name}</span>
                      <span className="order-item-qty-price">
                        {item.quantity} × ₹{item.price} = <strong>₹{item.quantity * item.price}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery & Payment Details */}
              <div className="order-card-footer">
                <div className="order-address-info">
                  <div className="info-sub-row">
                    <MapPin size={15} className="info-icon" />
                    <span><strong>Address:</strong> {order.deliveryAddress}</span>
                  </div>
                  <div className="info-sub-row">
                    <Phone size={15} className="info-icon" />
                    <span><strong>Phone:</strong> {order.phoneNumber}</span>
                  </div>
                  <div className="info-sub-row">
                    <span><strong>Payment:</strong> {order.paymentMethod} ({order.paymentStatus})</span>
                  </div>
                </div>

                <div className="order-total-block">
                  <div className="total-display">
                    <span className="total-label">Total Paid:</span>
                    <span className="total-value">₹{order.totalAmount}</span>
                  </div>

                  {/* College Viva Simulation Action */}
                  {nextStatus && (
                    <button
                      className="btn-outline-status"
                      onClick={() => handleSimulateStatus(order._id, order.orderStatus)}
                      disabled={updatingId === order._id}
                      title="Simulate next status step for demonstration"
                    >
                      {updatingId === order._id ? 'Updating...' : `Simulate: Advance to "${nextStatus}"`}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderHistory;
