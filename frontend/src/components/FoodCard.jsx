import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Star, Plus, Minus, ShoppingBag, Eye } from 'lucide-react';

const FoodCard = ({ food, onOpenDetails }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const cartItem = cartItems.find((item) => item._id === food._id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(food, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 800);
  };

  const handleIncrease = (e) => {
    e.stopPropagation();
    updateQuantity(food._id, 1);
  };

  const handleDecrease = (e) => {
    e.stopPropagation();
    updateQuantity(food._id, -1);
  };

  return (
    <div className="food-card" onClick={() => onOpenDetails && onOpenDetails(food)}>
      {/* Image & Badges */}
      <div className="food-image-wrapper">
        <img
          src={food.image}
          alt={food.name}
          className="food-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="food-badges-top">
          <span className="category-tag">{food.category}</span>
          <span className={`diet-indicator ${food.isVeg ? 'veg' : 'non-veg'}`}>
            <span className="diet-dot"></span>
            {food.isVeg ? 'Veg' : 'Non-Veg'}
          </span>
        </div>

        {/* Quick View Overlay Button */}
        <button
          className="btn-quick-view"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails && onOpenDetails(food);
          }}
          title="Quick View Details"
        >
          <Eye size={16} /> Details
        </button>
      </div>

      {/* Card Content */}
      <div className="food-info">
        <div className="food-title-row">
          <h3 className="food-name">{food.name}</h3>
          <div className="food-rating">
            <Star size={14} className="star-icon" />
            <span>{food.rating || 4.5}</span>
          </div>
        </div>

        <p className="food-desc" title={food.description}>
          {food.description}
        </p>

        <div className="food-footer">
          <div className="food-price-wrapper">
            <span className="price-symbol">₹</span>
            <span className="price-amount">{food.price}</span>
          </div>

          <div className="food-action">
            {quantityInCart > 0 ? (
              <div className="quantity-controls" onClick={(e) => e.stopPropagation()}>
                <button
                  className="btn-qty btn-minus"
                  onClick={handleDecrease}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="qty-count">{quantityInCart}</span>
                <button
                  className="btn-qty btn-plus"
                  onClick={handleIncrease}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              <button
                className={`btn-add-cart ${justAdded ? 'added' : ''}`}
                onClick={handleAdd}
              >
                <ShoppingBag size={15} />
                <span>{justAdded ? 'Added!' : 'Add'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
