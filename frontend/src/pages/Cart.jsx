import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
} from 'lucide-react';

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    tax,
    totalAmount,
    totalCount,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const freeDeliveryThreshold = 500;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty-page">
        <div className="empty-cart-card">
          <div className="empty-cart-icon-wrapper">
            <ShoppingBag size={56} className="empty-bag-icon" />
          </div>
          <h2>Your Cart is Currently Empty</h2>
          <p>
            Looks like you haven't added any delicious food items to your cart yet.
            Explore our Pizza, Burger, Biryani, Pasta, and Sandwiches!
          </p>
          <Link to="/menu" className="btn-primary empty-cart-btn">
            Explore Food Menu <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <div>
          <h1 className="page-title">Shopping Cart</h1>
          <p className="page-subtitle">
            You have <strong>{totalCount}</strong> {totalCount === 1 ? 'item' : 'items'} in your basket
          </p>
        </div>
        <button
          className="btn-text-danger"
          onClick={clearCart}
          title="Remove all items from cart"
        >
          <Trash2 size={16} /> Clear Cart
        </button>
      </div>

      {/* Free Delivery Banner */}
      {remainingForFreeDelivery > 0 ? (
        <div className="delivery-promo-banner">
          <Truck size={20} className="promo-icon" />
          <span>
            Add <strong>₹{remainingForFreeDelivery}</strong> more to your order for <strong>FREE Delivery!</strong>
          </span>
        </div>
      ) : (
        <div className="delivery-promo-banner success">
          <Truck size={20} className="promo-icon" />
          <span>🎉 Congratulations! You have unlocked <strong>FREE Delivery!</strong></span>
        </div>
      )}

      <div className="cart-layout-grid">
        {/* Cart Items List */}
        <div className="cart-items-section">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item-card">
              <img
                src={item.image}
                alt={item.name}
                className="cart-item-img"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
                }}
              />

              <div className="cart-item-details">
                <div className="cart-item-head">
                  <h3 className="cart-item-title">{item.name}</h3>
                  <button
                    className="btn-remove-item"
                    onClick={() => removeFromCart(item._id)}
                    aria-label={`Remove ${item.name} from cart`}
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="cart-item-meta">
                  <span className="cart-item-category">{item.category}</span>
                  <span className="cart-item-unit-price">₹{item.price} each</span>
                </div>

                <div className="cart-item-actions-row">
                  <div className="quantity-controls">
                    <button
                      className="btn-qty"
                      onClick={() => updateQuantity(item._id, -1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="qty-count">{item.quantity}</span>
                    <button
                      className="btn-qty"
                      onClick={() => updateQuantity(item._id, 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="cart-item-total-price">
                    <span className="sub-label">Subtotal:</span>
                    <span className="amount">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="cart-footer-nav">
            <Link to="/menu" className="btn-secondary">
              <ArrowLeft size={16} /> Add More Items
            </Link>
          </div>
        </div>

        {/* Order Cost Summary Card */}
        <div className="cart-summary-section">
          <div className="order-summary-card">
            <h2 className="summary-title">Order Summary</h2>

            <div className="summary-breakdown">
              <div className="summary-row">
                <span>Items Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="free-badge">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="summary-row">
                <span>GST / Taxes (5%)</span>
                <span>₹{tax}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total-row">
                <span>Total Amount</span>
                <span className="total-price">₹{totalAmount}</span>
              </div>
            </div>

            <button
              className="btn-primary checkout-btn"
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <div className="trust-badges">
              <div className="trust-item">
                <ShieldCheck size={16} className="trust-icon" />
                <span>100% Safe & Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
