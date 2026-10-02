import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  MapPin,
  Phone,
  User,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

const Checkout = () => {
  const { cartItems, subtotal, deliveryFee, tax, totalAmount, clearCart } =
    useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  if (cartItems.length === 0 && !placedOrder) {
    return (
      <div className="cart-empty-page">
        <div className="empty-cart-card">
          <h2>Your Cart is Empty</h2>
          <p>Please add food items to your cart before proceeding to checkout.</p>
          <Link to="/menu" className="btn-primary">
            Browse Food Menu
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim() || !phoneNumber.trim() || !deliveryAddress.trim()) {
      setErrorMessage('Please fill in Customer Name, Phone Number, and Delivery Address');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          food: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        deliveryAddress: deliveryAddress.trim(),
        deliveryNotes: deliveryNotes.trim(),
        paymentMethod,
      };

      const res = await API.post('/orders', orderPayload);

      if (res.data?.success) {
        setPlacedOrder(res.data.order);
        clearCart();
      } else {
        setErrorMessage(res.data?.message || 'Failed to place order.');
      }
    } catch (err) {
      console.error('Order submission error:', err);
      setErrorMessage(
        err.response?.data?.message || err.message || 'Error processing your order.'
      );
    } finally {
      setLoading(false);
    }
  };

  // If order was successfully placed, render Order Confirmation View
  if (placedOrder) {
    return (
      <div className="order-confirmation-container">
        <div className="confirmation-card">
          <div className="confirmation-badge">
            <CheckCircle size={56} className="success-icon" />
          </div>

          <h1 className="confirmation-title">Order Placed Successfully!</h1>
          <p className="confirmation-sub">
            Thank you for ordering with FoodExpress! Your order record has been created in MongoDB.
          </p>

          <div className="order-details-box">
            <div className="order-meta-grid">
              <div>
                <span className="meta-label">Order ID:</span>
                <strong className="order-id-code">{placedOrder._id}</strong>
              </div>
              <div>
                <span className="meta-label">Payment Method:</span>
                <strong>{placedOrder.paymentMethod}</strong>
              </div>
              <div>
                <span className="meta-label">Status:</span>
                <span className="status-badge placed">{placedOrder.orderStatus}</span>
              </div>
              <div>
                <span className="meta-label">Total Amount:</span>
                <strong className="total-accent">₹{placedOrder.totalAmount}</strong>
              </div>
            </div>

            <div className="delivery-summary-box">
              <p>
                <strong>Delivery Address:</strong> {placedOrder.deliveryAddress}
              </p>
              <p>
                <strong>Contact Phone:</strong> {placedOrder.phoneNumber}
              </p>
            </div>

            <div className="ordered-items-list">
              <h4>Ordered Items ({placedOrder.items.length})</h4>
              {placedOrder.items.map((it, idx) => (
                <div key={idx} className="ordered-item-row">
                  <span>
                    {it.name} × {it.quantity}
                  </span>
                  <span>₹{it.price * it.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="confirmation-actions">
            <Link to="/orders" className="btn-primary">
              View Order in Order History
            </Link>
            <Link to="/menu" className="btn-secondary">
              Order More Food
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <button className="btn-back" onClick={() => navigate('/cart')}>
        <ArrowLeft size={18} /> Back to Cart
      </button>

      <h1 className="page-title">Delivery & Checkout</h1>
      <p className="page-subtitle">Complete your details to place your order</p>

      {errorMessage && (
        <div className="alert-error">
          <AlertCircle size={20} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="checkout-grid">
        {/* Left Column: Customer and Delivery Form */}
        <div className="checkout-form-section">
          {/* Customer Details Card */}
          <div className="checkout-card">
            <h2 className="card-heading">
              <User size={20} /> Customer & Contact Information
            </h2>

            <div className="form-group">
              <label htmlFor="customerName" className="form-label">
                Full Name *
              </label>
              <input
                id="customerName"
                type="text"
                className="form-input"
                placeholder="Enter recipient's full name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number *
              </label>
              <div className="input-with-icon">
                <Phone size={18} className="field-icon" />
                <input
                  id="phoneNumber"
                  type="tel"
                  className="form-input with-icon"
                  placeholder="e.g. +91 98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="checkout-card">
            <h2 className="card-heading">
              <MapPin size={20} /> Delivery Destination
            </h2>

            <div className="form-group">
              <label htmlFor="deliveryAddress" className="form-label">
                Complete Delivery Address *
              </label>
              <textarea
                id="deliveryAddress"
                rows="3"
                className="form-textarea"
                placeholder="Door/Flat No., Hostel/Apartment Name, Street, Landmark, City, Pincode"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="deliveryNotes" className="form-label">
                Delivery Notes / Instructions (Optional)
              </label>
              <input
                id="deliveryNotes"
                type="text"
                className="form-input"
                placeholder="e.g. Leave at hostel gate, ring bell twice, etc."
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="checkout-card">
            <h2 className="card-heading">
              <CreditCard size={20} /> Choose Payment Method
            </h2>

            <div className="payment-options-grid">
              <label
                className={`payment-option-label ${
                  paymentMethod === 'Cash on Delivery' ? 'selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <Banknote size={24} className="pay-icon" />
                <div className="pay-text">
                  <strong>Cash on Delivery (COD)</strong>
                  <span>Pay with cash or UPI on doorstep arrival</span>
                </div>
              </label>

              <label
                className={`payment-option-label ${
                  paymentMethod === 'UPI Payment' ? 'selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="UPI Payment"
                  checked={paymentMethod === 'UPI Payment'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <Smartphone size={24} className="pay-icon" />
                <div className="pay-text">
                  <strong>UPI Simulation</strong>
                  <span>Google Pay, PhonePe, Paytm, or BHIM</span>
                </div>
              </label>

              <label
                className={`payment-option-label ${
                  paymentMethod === 'Credit/Debit Card' ? 'selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Credit/Debit Card"
                  checked={paymentMethod === 'Credit/Debit Card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <CreditCard size={24} className="pay-icon" />
                <div className="pay-text">
                  <strong>Credit / Debit Card</strong>
                  <span>Visa, MasterCard, RuPay (Demo Mode)</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review & Place Order Button */}
        <div className="checkout-summary-section">
          <div className="order-summary-card">
            <h3 className="summary-title">Order Summary ({cartItems.length} items)</h3>

            <div className="checkout-items-mini">
              {cartItems.map((item) => (
                <div key={item._id} className="checkout-item-mini-row">
                  <div className="item-name-qty">
                    <span className="qty-tag">{item.quantity}x</span>
                    <span className="name">{item.name}</span>
                  </div>
                  <span className="price">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-breakdown">
              <div className="summary-row">
                <span>Items Subtotal:</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Charge:</span>
                <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              <div className="summary-row">
                <span>GST / Taxes (5%):</span>
                <span>₹{tax}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total-row">
                <span>Grand Total:</span>
                <span className="total-price">₹{totalAmount}</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary place-order-btn"
              disabled={loading}
            >
              {loading ? 'Submitting to MongoDB...' : `Place Order (₹${totalAmount})`}
            </button>

            <div className="trust-badges">
              <div className="trust-item">
                <ShieldCheck size={16} className="trust-icon" />
                <span>MongoDB Atlas Database Record Created</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
