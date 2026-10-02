import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  UtensilsCrossed,
  ShoppingCart,
  User,
  LogOut,
  Menu as MenuIcon,
  X,
  Clock,
  LayoutDashboard,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={closeMenu}>
          <div className="brand-icon-wrapper">
            <UtensilsCrossed className="brand-icon" size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-name">Food<span className="accent-text">Express</span></span>
            <span className="brand-tagline">Fast & Fresh Delivery</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links desktop-only">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Home
          </NavLink>
          <NavLink
            to="/menu"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Food Menu
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink
                to="/orders"
                className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
              >
                <Clock size={16} />
                <span>My Orders</span>
              </NavLink>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Right Actions: Cart & User Auth */}
        <div className="nav-actions">
          {/* Cart Button */}
          <Link to="/cart" className="cart-btn" aria-label="Shopping Cart">
            <ShoppingCart size={22} />
            {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
          </Link>

          {/* User Auth Buttons */}
          <div className="desktop-only user-auth-actions">
            {isAuthenticated ? (
              <div className="user-pill">
                <div className="user-avatar" title={user?.name}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="user-name-display">{user?.name?.split(' ')[0]}</span>
                <button
                  onClick={handleLogout}
                  className="btn-logout"
                  title="Log Out"
                  aria-label="Log Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="auth-buttons-group">
                <Link to="/login" className="btn-secondary">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-menu-toggle mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <MenuIcon size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer mobile-only">
          <NavLink to="/" end className="mobile-nav-item" onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/menu" className="mobile-nav-item" onClick={closeMenu}>
            Food Menu
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/orders" className="mobile-nav-item" onClick={closeMenu}>
                My Orders
              </NavLink>
              <NavLink to="/dashboard" className="mobile-nav-item" onClick={closeMenu}>
                Dashboard
              </NavLink>
              <div className="mobile-user-section">
                <p className="mobile-user-greeting">
                  Signed in as <strong>{user?.name}</strong>
                </p>
                <button onClick={handleLogout} className="btn-logout-full">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </>
          ) : (
            <div className="mobile-auth-links">
              <Link to="/login" className="btn-secondary full-width" onClick={closeMenu}>
                Sign In
              </Link>
              <Link to="/register" className="btn-primary full-width" onClick={closeMenu}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
