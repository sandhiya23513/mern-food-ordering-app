import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import FoodCard from '../components/FoodCard';
import FoodModal from '../components/FoodModal';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  Award,
  Sparkles,
  Flame,
  Tag,
  Star,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';

const CATEGORIES = [
  { name: 'All', icon: '🍽️' },
  { name: 'Pizza', icon: '🍕' },
  { name: 'Burger', icon: '🍔' },
  { name: 'Biryani', icon: '🍚' },
  { name: 'Pasta', icon: '🍝' },
  { name: 'Sandwich', icon: '🥪' },
  { name: 'Snacks', icon: '🍟' },
  { name: 'Desserts', icon: '🍰' },
];

const OFFERS = [
  {
    code: 'WELCOME50',
    title: '50% OFF First Order',
    desc: 'Enjoy flat 50% discount up to ₹150 on your first food order.',
    badge: 'Limited Time',
    color: '#ff5722',
  },
  {
    code: 'FREEDEL',
    title: 'Free Delivery',
    desc: 'Get zero delivery charges automatically on all orders above ₹500.',
    badge: 'Auto Applied',
    color: '#16a34a',
  },
  {
    code: 'COMBO99',
    title: 'Mega Combo Deal',
    desc: 'Get Burger + Crispy Fries + Cold Coffee combo starting at ₹299.',
    badge: 'Bestseller',
    color: '#8b5cf6',
  },
];

const REVIEWS = [
  {
    name: 'Ananya Sharma',
    rating: 5,
    comment: 'The Hyderabadi Biryani and Margherita Pizza arrived piping hot in just 22 minutes! Super tasty and fresh ingredients.',
    dish: 'Ordered: Hyderabadi Dum Biryani',
  },
  {
    name: 'Karan Patel',
    rating: 5,
    comment: 'Best burgers and pasta in town. The quantity is generous and ordering on FoodExpress is seamless!',
    dish: 'Ordered: Classic Veggie Cheese Burger',
  },
  {
    name: 'Pooja Iyer',
    rating: 5,
    comment: 'Clean packaging, prompt delivery rider, and the Grilled Club Sandwich was crispy and delicious.',
    dish: 'Ordered: Grilled Club Sandwich',
  },
];

const Home = () => {
  const [featuredFoods, setFeaturedFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await API.get('/foods');
        if (res.data && res.data.data) {
          setFeaturedFoods(res.data.data.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to load foods:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/menu');
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Fast & Reliable Food Delivery</span>
          </div>

          <h1 className="hero-title">
            Delicious Food, <br />
            <span className="gradient-text">Delivered In Minutes.</span>
          </h1>

          <p className="hero-subtitle">
            Order your favorite Pizza, Burger, Biryani, Pasta, and Sandwiches crafted with fresh premium ingredients and delivered piping hot to your doorstep.
          </p>

          {/* Search Bar in Hero */}
          <form className="hero-search-form" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                className="hero-search-input"
                placeholder="Search Pizza, Burger, Biryani, Pasta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary hero-btn">
              Find Food <ArrowRight size={18} />
            </button>
          </form>

          {/* Quick Metrics */}
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">20-30 min</span>
              <span className="stat-label">Fast Delivery</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">4.8 ★</span>
              <span className="stat-label">Customer Rating</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">100% Fresh</span>
              <span className="stat-label">Quality Guaranteed</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-img-card">
            <img
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80"
              alt="Delicious Fresh Pizza"
              className="hero-img-main"
            />
            <div className="floating-badge badge-top">
              <Flame size={18} className="badge-icon-flame" />
              <div>
                <strong>Hot & Fresh</strong>
                <p>Oven-Baked Goodness</p>
              </div>
            </div>
            <div className="floating-badge badge-bottom">
              <span className="badge-emoji">⚡</span>
              <div>
                <strong>30 Mins Guaranteed</strong>
                <p>Or Free Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Deals & Offers Bar */}
      <section className="deals-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Today's Special Deals & Coupons</h2>
            <p className="section-subtitle">Save big on your favorite meals with active vouchers</p>
          </div>
        </div>

        <div className="deals-grid">
          {OFFERS.map((offer, idx) => (
            <div key={idx} className="deal-card" style={{ borderLeftColor: offer.color }}>
              <div className="deal-top">
                <span className="deal-badge" style={{ backgroundColor: offer.color }}>
                  {offer.badge}
                </span>
                <span className="deal-code">
                  <Tag size={13} /> {offer.code}
                </span>
              </div>
              <h3 className="deal-title">{offer.title}</h3>
              <p className="deal-desc">{offer.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Bar */}
      <section className="categories-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Explore by Category</h2>
            <p className="section-subtitle">Quickly find what you're craving today</p>
          </div>
          <Link to="/menu" className="view-all-link">
            See All Items <ArrowRight size={16} />
          </Link>
        </div>

        <div className="categories-grid">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={cat.name === 'All' ? '/menu' : `/menu?category=${cat.name}`}
              className="category-chip"
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Items Showcase */}
      <section className="featured-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Popular Dishes You'll Love</h2>
            <p className="section-subtitle">
              Handmade fresh to order: Pizza (₹250), Burger (₹150), Biryani (₹220), Pasta (₹180), Sandwich (₹120)
            </p>
          </div>
          <Link to="/menu" className="btn-secondary">
            View Full Menu
          </Link>
        </div>

        {loading ? (
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Loading fresh food items...</p>
          </div>
        ) : (
          <div className="food-grid">
            {featuredFoods.map((food) => (
              <FoodCard
                key={food._id}
                food={food}
                onOpenDetails={(item) => setSelectedFood(item)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="features-banner">
        <h2 className="section-title text-center">Why Customers Love FoodExpress</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-box">
              <Zap size={28} />
            </div>
            <h3>Lightning Delivery</h3>
            <p>Our dedicated delivery fleet brings your food fresh and hot in 30 minutes or less.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box">
              <ShieldCheck size={28} />
            </div>
            <h3>100% Hygienic Food</h3>
            <p>Prepared in certified commercial kitchens strictly following premium hygiene standards.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box">
              <Award size={28} />
            </div>
            <h3>Pocket Friendly</h3>
            <p>Delicious food starting at just ₹99 with regular cashback discounts and free delivery perks.</p>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="reviews-section">
        <div className="section-header text-center-wrap">
          <h2 className="section-title">What Our Foodies Say</h2>
          <p className="section-subtitle">Over 10,000+ satisfied meals delivered across the city</p>
        </div>

        <div className="reviews-grid">
          {REVIEWS.map((rev, idx) => (
            <div key={idx} className="review-card">
              <div className="review-stars">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={16} className="star-filled" />
                ))}
              </div>
              <p className="review-comment">"{rev.comment}"</p>
              <div className="review-author">
                <strong>{rev.name}</strong>
                <span className="review-dish">{rev.dish}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Food App Promo Banner */}
      <section className="app-promo-banner">
        <div className="app-promo-content">
          <span className="app-tag">FAST ORDERING ON THE GO</span>
          <h2>Download FoodExpress Today</h2>
          <p>
            Track your delivery rider in real-time, get exclusive secret coupons, and save your favorite meals for 1-click reordering.
          </p>
          <div className="app-points">
            <div className="app-point"><CheckCircle2 size={16} /> Live GPS Delivery Tracking</div>
            <div className="app-point"><CheckCircle2 size={16} /> Exclusive App-Only Discounts</div>
            <div className="app-point"><CheckCircle2 size={16} /> Contactless Doorstep Drop-off</div>
          </div>
          <div className="app-buttons">
            <Link to="/menu" className="btn-primary">
              Order Online Now <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        <div className="app-promo-icon">
          <Smartphone size={100} className="phone-icon-art" />
        </div>
      </section>

      {/* Modal Dialog */}
      {selectedFood && (
        <FoodModal
          food={selectedFood}
          onClose={() => setSelectedFood(null)}
        />
      )}
    </div>
  );
};

export default Home;
