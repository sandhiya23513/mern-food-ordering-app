import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, UtensilsCrossed, Phone, Mail, MapPin, ShieldCheck, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-column brand-col">
          <div className="footer-brand">
            <span className="brand-name">Food<span className="accent-text">Express</span></span>
          </div>
          <p className="footer-desc">
            Bringing culinary excellence straight to your doorstep. Order fresh pizzas, juicy burgers, royal biryanis, and mouthwatering pastas delivered fast and hot.
          </p>
          <div className="footer-contact-mini">
            <div className="contact-mini-row"><Phone size={14} /> +91 98765 43210 (Customer Helpline)</div>
            <div className="contact-mini-row"><Mail size={14} /> support@foodexpress.com</div>
            <div className="contact-mini-row"><Clock size={14} /> Open Daily: 10:00 AM - 11:30 PM</div>
          </div>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Food Menu</Link></li>
            <li><Link to="/cart">Shopping Cart</Link></li>
            <li><Link to="/orders">Track My Orders</Link></li>
            <li><Link to="/dashboard">My Account</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">Popular Cuisines</h4>
          <ul className="footer-links">
            <li><Link to="/menu?category=Pizza">Italian Woodfired Pizza</Link></li>
            <li><Link to="/menu?category=Burger">Crispy Gourmet Burgers</Link></li>
            <li><Link to="/menu?category=Biryani">Hyderabadi Dum Biryani</Link></li>
            <li><Link to="/menu?category=Pasta">Creamy Alfredo Pasta</Link></li>
            <li><Link to="/menu?category=Sandwich">Toasted Club Sandwiches</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">Quality Promise</h4>
          <p className="footer-info">
            Every dish is made with fresh ingredients, prepared in sanitized kitchens, and delivered with contactless safety.
          </p>
          <div className="footer-badges-list">
            <span className="trust-pill"><ShieldCheck size={13} /> 100% Food Hygiene</span>
            <span className="trust-pill"><Clock size={13} /> 30-Min Fast Delivery</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} FoodExpress Inc. All rights reserved. Made with <Heart size={14} className="heart-icon" /> for food lovers.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
