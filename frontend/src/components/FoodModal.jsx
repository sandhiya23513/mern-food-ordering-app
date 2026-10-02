import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { X, Star, Clock, ShoppingBag, Plus, Minus, Check } from 'lucide-react';

const FoodModal = ({ food, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!food) return null;

  const handleAddToCart = () => {
    addToCart(food, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 800);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="modal-grid">
          <div className="modal-image-wrapper">
            <img
              src={food.image}
              alt={food.name}
              className="modal-image"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <span className={`modal-diet-tag ${food.isVeg ? 'veg' : 'non-veg'}`}>
              <span className="diet-dot"></span>
              {food.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
            </span>
          </div>

          <div className="modal-body">
            <div className="modal-header-meta">
              <span className="modal-category-badge">{food.category}</span>
              <div className="modal-rating">
                <Star size={16} className="star-icon" />
                <span>{food.rating || 4.8} / 5</span>
              </div>
            </div>

            <h2 className="modal-title">{food.name}</h2>
            <p className="modal-description">{food.description}</p>

            <div className="modal-features">
              <div className="feature-item">
                <Clock size={16} className="feature-icon" />
                <span>Prep: {food.preparationTime || '20 mins'}</span>
              </div>
              <div className="feature-item">
                <ShoppingBag size={16} className="feature-icon" />
                <span>Freshly Cooked on Order</span>
              </div>
            </div>

            <div className="modal-divider"></div>

            <div className="modal-pricing-row">
              <div>
                <span className="modal-price-label">Price per item:</span>
                <div className="modal-price">₹{food.price}</div>
              </div>

              <div className="modal-qty-selector">
                <button
                  type="button"
                  className="modal-qty-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="modal-qty-val">{quantity}</span>
                <button
                  type="button"
                  className="modal-qty-btn"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className={`btn-primary modal-add-btn ${added ? 'btn-success' : ''}`}
                onClick={handleAddToCart}
              >
                {added ? (
                  <>
                    <Check size={18} /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} /> Add to Cart (₹{food.price * quantity})
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodModal;
