import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  User,
  ShoppingBag,
  Clock,
  IndianRupee,
  MapPin,
  Mail,
  Phone,
  Shield,
  ArrowRight,
  Package,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const res = await API.get('/orders/my-orders');
        if (res.data?.orders) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserStats();
  }, []);

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);
  const activeOrders = orders.filter((ord) => ord.orderStatus !== 'Delivered' && ord.orderStatus !== 'Cancelled').length;

  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome">
        <div>
          <h1 className="welcome-title">Welcome back, {user?.name || 'Customer'}! 👋</h1>
          <p className="welcome-subtitle">
            Manage your food orders, track active deliveries, and update profile settings.
          </p>
        </div>
        <Link to="/menu" className="btn-primary">
          Order Food Now <ArrowRight size={16} />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-box orange">
            <ShoppingBag size={24} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Orders</span>
            <span className="metric-value">{totalOrders}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box green">
            <IndianRupee size={24} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Amount Spent</span>
            <span className="metric-value">₹{totalSpent}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box blue">
            <Clock size={24} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Active Orders</span>
            <span className="metric-value">{activeOrders}</span>
          </div>
        </div>
      </div>

      {/* Profile & Recent Activity Grid */}
      <div className="dashboard-main-grid">
        {/* User Profile Card */}
        <div className="dash-card">
          <h2 className="dash-card-title">
            <User size={20} /> Customer Profile
          </h2>

          <div className="profile-details-list">
            <div className="profile-detail-row">
              <span className="p-label"><User size={15} /> Name:</span>
              <span className="p-value"><strong>{user?.name}</strong></span>
            </div>
            <div className="profile-detail-row">
              <span className="p-label"><Mail size={15} /> Email:</span>
              <span className="p-value">{user?.email}</span>
            </div>
            <div className="profile-detail-row">
              <span className="p-label"><Phone size={15} /> Phone:</span>
              <span className="p-value">{user?.phone || 'Not provided'}</span>
            </div>
            <div className="profile-detail-row">
              <span className="p-label"><MapPin size={15} /> Delivery Address:</span>
              <span className="p-value">{user?.address || 'Not provided'}</span>
            </div>
            <div className="profile-detail-row">
              <span className="p-label"><Shield size={15} /> Account Type:</span>
              <span className="p-value badge-pill capitalize">{user?.role || 'Customer'}</span>
            </div>
          </div>

          <div className="profile-actions">
            <Link to="/orders" className="btn-secondary full-width">
              View Order History
            </Link>
          </div>
        </div>

        {/* Recent Orders Overview */}
        <div className="dash-card">
          <h2 className="dash-card-title">
            <Package size={20} /> Recent Orders
          </h2>

          {loading ? (
            <div className="loader-container">
              <div className="spinner"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-recent-orders">
              <p>You haven't placed any orders yet.</p>
              <Link to="/menu" className="btn-primary" style={{ marginTop: '1rem' }}>
                Browse Food Menu
              </Link>
            </div>
          ) : (
            <div className="recent-orders-list">
              {orders.slice(0, 3).map((ord) => (
                <div key={ord._id} className="recent-order-item">
                  <div>
                    <strong>Order #{ord._id.slice(-6)}</strong>
                    <p className="order-item-count">{ord.items?.length || 1} items • ₹{ord.totalAmount}</p>
                  </div>
                  <span className={`status-pill status-${ord.orderStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                    {ord.orderStatus}
                  </span>
                </div>
              ))}
              <Link to="/orders" className="btn-secondary full-width" style={{ marginTop: '1rem' }}>
                View All {orders.length} Orders
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
