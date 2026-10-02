import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import FoodCard from '../components/FoodCard';
import FoodModal from '../components/FoodModal';
import { Search, Filter, RefreshCw, SlidersHorizontal, Sparkles } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Pizza',
  'Burger',
  'Biryani',
  'Pasta',
  'Sandwich',
  'Snacks',
  'Desserts',
  'Beverages',
];

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  const fetchFoods = async () => {
    setLoading(true);
    try {
      let url = '/foods?';
      if (selectedCategory && selectedCategory !== 'All') {
        url += `category=${encodeURIComponent(selectedCategory)}&`;
      }
      if (searchQuery.trim()) {
        url += `search=${encodeURIComponent(searchQuery.trim())}&`;
      }
      if (vegOnly) {
        url += `vegOnly=true&`;
      }

      const res = await API.get(url);
      if (res.data && res.data.data) {
        setFoods(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [selectedCategory, vegOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFoods();
  };

  const handleSeedMenu = async () => {
    setSeeding(true);
    try {
      await API.post('/foods/seed');
      await fetchFoods();
    } catch (err) {
      console.error('Error seeding foods:', err);
    } finally {
      setSeeding(false);
    }
  };

  // Sort items client-side
  const sortedFoods = [...foods].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="menu-page">
      {/* Menu Header */}
      <div className="menu-header">
        <div className="menu-title-block">
          <span className="badge-pill">
            <Sparkles size={14} /> Full Culinary Menu
          </span>
          <h1 className="menu-heading">Explore Our Delicious Menu</h1>
          <p className="menu-subtext">
            Handcrafted with fresh ingredients: Pizza (₹250), Burger (₹150), Biryani (₹220), Pasta (₹180), Sandwich (₹120) & more.
          </p>
        </div>

        {/* Quick Seed Button for college demo */}
        <button
          className="btn-outline seed-btn"
          onClick={handleSeedMenu}
          disabled={seeding}
          title="Reset & Seed default food items into MongoDB"
        >
          <RefreshCw size={15} className={seeding ? 'spin' : ''} />
          {seeding ? 'Seeding MongoDB...' : 'Reset/Seed Menu Data'}
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="menu-controls-card">
        {/* Category Pill Tabs */}
        <div className="category-scroll-container">
          <div className="category-tabs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`cat-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSearchParams(cat === 'All' ? {} : { category: cat });
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Sort Bar */}
        <div className="controls-row">
          <form className="menu-search-form" onSubmit={handleSearchSubmit}>
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search dishes by name or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="menu-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
              >
                ×
              </button>
            )}
          </form>

          <div className="filter-options">
            {/* Veg Only Toggle */}
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={vegOnly}
                onChange={(e) => setVegOnly(e.target.checked)}
                className="toggle-checkbox"
              />
              <span className="toggle-switch"></span>
              <span className="toggle-text">Veg Only</span>
            </label>

            {/* Sort Dropdown */}
            <div className="sort-wrapper">
              <SlidersHorizontal size={16} className="sort-icon" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="default">Default Order</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Food Grid / Empty States */}
      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Fetching food menu from MongoDB...</p>
        </div>
      ) : sortedFoods.length === 0 ? (
        <div className="empty-state-box">
          <div className="empty-icon">🍽️</div>
          <h3>No food items found matching your filters</h3>
          <p>Try resetting filters or click the button below to seed dishes into MongoDB.</p>
          <div className="empty-actions">
            <button
              className="btn-secondary"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setVegOnly(false);
              }}
            >
              Reset Filters
            </button>
            <button className="btn-primary" onClick={handleSeedMenu} disabled={seeding}>
              Seed Food Data into MongoDB
            </button>
          </div>
        </div>
      ) : (
        <div className="food-grid">
          {sortedFoods.map((food) => (
            <FoodCard
              key={food._id}
              food={food}
              onOpenDetails={(item) => setSelectedFood(item)}
            />
          ))}
        </div>
      )}

      {/* Food Details Modal */}
      {selectedFood && (
        <FoodModal
          food={selectedFood}
          onClose={() => setSelectedFood(null)}
        />
      )}
    </div>
  );
};

export default Menu;
