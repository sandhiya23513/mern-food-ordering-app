import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import {
  ArrowLeft,
  Star,
  Clock,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  ShieldCheck,
  Utensils,
} from 'lucide-react';

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await API.get(`/foods/${id}`);
        if (res.data?.data) {
          setFood(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching food detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFood();
  }, [id]);

  const handleAddToCart = () => {
    if (!food) return;
    addToCart(food, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  if (loading) {
    return (
      <div className="loader-container page-padding">
        <div className="spinner"></div>
        <p>Loading dish details...</p>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="empty-state-box page-padding">
        <h2>Food Item Not Found</h2>
        <p>The requested dish might have been removed or does not exist.</p>
        <Link to="/menu" className="btn-primary">
          Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="food-detail-page">
      <button className="btn-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Back
      </button>

      <div className="food-detail-card">
        <div className="detail-media">
          <img
            src={food.image}
            alt={food.name}
            className="detail-image"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <span className={`detail-diet-badge ${food.isVeg ? 'veg' : 'non-veg'}`}>
            <span className="diet-dot"></span>
            {food.isVeg ? '100% Vegetarian' : 'Non-Vegetarian'}
          </span>
        </div>

        <div className="detail-info">
          <div className="detail-meta">
            <span className="detail-category">{food.category}</span>
            <div className="detail-rating">
              <Star size={16} className="star-icon" />
              <span>{food.rating || 4.8} / 5 Rating</span>
            </div>
          </div>

          <h1 className="detail-title">{food.name}</h1>
          <p className="detail-desc">{food.description}</p>

          <div className="detail-specs">
            <div className="spec-item">
              <Clock size={18} className="spec-icon" />
              <div>
                <strong>Prep Time</strong>
                <p>{food.preparationTime || '20-25 mins'}</p>
              </div>
            </div>
            <div className="spec-item">
              <Utensils size={18} className="spec-icon" />
              <div>
                <strong>Portion</strong>
                <p>Serves 1-2 people</p>
              </div>
            </div>
            <div className="spec-item">
              <ShieldCheck size={18} className="spec-icon" />
              <div>
                <strong>Hygiene</strong>
                <p>100% Kitchen Safe</p>
              </div>
            </div>
          </div>

          <div className="detail-pricing-box">
            <div>
              <span className="detail-price-label">Price:</span>
              <span className="detail-price">₹{food.price}</span>
            </div>

            <div className="quantity-controls large">
              <button
                className="btn-qty"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus size={16} />
              </button>
              <span className="qty-count">{quantity}</span>
              <button
                className="btn-qty"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="detail-actions">
            <button
              className={`btn-primary add-detail-btn ${added ? 'btn-success' : ''}`}
              onClick={handleAddToCart}
            >
              {added ? (
                <>
                  <Check size={20} /> Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingBag size={20} /> Add to Cart (₹{food.price * quantity})
                </>
              )}
            </button>
            <Link to="/cart" className="btn-secondary">
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
