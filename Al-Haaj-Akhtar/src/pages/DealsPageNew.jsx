import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Cart from '../components/Cart';
import OrderModal from '../components/OrderModal';
import FloatingCartButton from '../components/FloatingCartButton';
import { sendWhatsAppMessage } from '../hooks';
import { useDealsData, isRestaurantOpen } from '../hooks/useDealsData';

// Check if deal is available based on timing (Dinner deals only after 5 PM)
const isDealAvailableNow = (deal) => {
  if (!isRestaurantOpen()) return false;
  
  const now = new Date();
  const hour = now.getHours();
  const timing = (deal.timing || '').toLowerCase();
  
  // Lunch deals available all day when restaurant is open
  if (timing.includes('lunch')) return true;
  
  // Dinner deals only available after 5 PM
  if (timing.includes('dinner')) {
    return hour >= 17 || hour < 2; // 5 PM onwards or late night
  }
  
  // Default: available if restaurant is open
  return true;
};

const branches = [
  { id: 'nagan', name: 'Nagan Head Office', address: 'Nagan Chowrangi, Karachi', tag: 'Head Office' },
  { id: 'gulshan', name: 'Gulshan Campus', address: 'Gulshan-e-Iqbal, Karachi', tag: 'Central' },
  { id: 'jauhar', name: 'Jauhar Campus', address: 'Gulistan-e-Jauhar, Karachi', tag: 'Main' }
];

const categoryImages = {
  'All': '/food/platter-removebg-preview.png',
  'Daig': '/food/pakwan-removebg-preview.png',
  'Biryani': '/food/pakwan-removebg-preview.png',
  'Pulao': '/food/pulao-removebg-preview.png',
  'Rice': '/food/pulao-removebg-preview.png',
  'Chinese': '/food/chinese_rice_with_sashlik-removebg-preview.png',
  'Chinese Rice': '/food/chinese_rice_with_sashlik-removebg-preview.png',
  'Chopsuey': '/food/American_chopsuey-removebg-preview.png',
  'BBQ': '/food/tikka-removebg-preview.png',
  'Grill': '/food/tikka-removebg-preview.png',
  'Tikka': '/food/tikka-removebg-preview.png',
  'Chicken Tikka': '/food/tikka-removebg-preview.png',
  'Kabab': '/food/kabab-removebg-preview.png',
  'Seekh Kabab': '/food/kabab-removebg-preview.png',
  'Wings': '/food/wings-removebg-preview.png',
  'Chicken Wings': '/food/wings-removebg-preview.png',
  'Nuggets': '/food/nuggets-removebg-preview.png',
  'Fish': '/food/fish_finger-removebg-preview.png',
  'Fish Finger': '/food/fish_finger-removebg-preview.png',
  'Karahi': '/food/Chicken_Karahi-removebg-preview.png',
  'Chicken Karahi': '/food/Chicken_Karahi-removebg-preview.png',
  'Qorma': '/food/Qorma-removebg-preview.png',
  'Handi': '/food/handi-removebg-preview.png',
  'Daal': '/food/daal-removebg-preview.png',
  'Sabzi': '/food/sabzi-removebg-preview.png',
  'Gravy': '/food/ChickenGravvy_with_rice-removebg-preview.png',
  'Chicken Gravy': '/food/ChickenGravvy_with_rice-removebg-preview.png',
  'Platter': '/food/platter-removebg-preview.png',
  'Family': '/food/platter-removebg-preview.png',
  'Combo': '/food/platter-removebg-preview.png',
  'Family Pack': '/food/platter-removebg-preview.png',
  'Party': '/food/platter-removebg-preview.png',
  'Value': '/food/platter-removebg-preview.png',
  'Burger': '/food/burger-removebg-preview.png',
  'Pizza': '/food/pizza-removebg-preview.png',
  'Roll': '/food/roll-removebg-preview.png',
  'Sandwich': '/food/sandwhich-removebg-preview.png',
  'Broast': '/food/broast-removebg-preview.png',
  'Chicken Strips': '/food/chicken_strips-removebg-preview.png',
  'Naan': '/food/naan-removebg-preview.png',
  'Roti': '/food/naan-removebg-preview.png',
  'Paratha': '/food/naan-removebg-preview.png',
  'Dessert': '/food/kheer-removebg-preview.png',
  'Kheer': '/food/kheer-removebg-preview.png',
  'Ice Cream': '/food/desserts_icecream-removebg-preview.png',
  'Sweets': '/food/kheer-removebg-preview.png',
  'Beverage': '/food/cold-can-stands-against-red-droplets-hinting-frosty-touch-removebg-preview.png',
  'Drink': '/food/cold-can-stands-against-red-droplets-hinting-frosty-touch-removebg-preview.png',
  'Cold Drink': '/food/cold-can-stands-against-red-droplets-hinting-frosty-touch-removebg-preview.png',
  'Raan': '/food/Afghani_Boti-removebg-preview.png',
  'Mutton': '/food/Afghani_Boti-removebg-preview.png',
  'Afghani': '/food/Afghani_Boti-removebg-preview.png',
  'Afghani Boti': '/food/Afghani_Boti-removebg-preview.png',
  'Salad': '/food/salad-removebg-preview.png',
  'Soup': '/food/soup-removebg-preview.png',
  'Boti': '/food/Afghani_Boti-removebg-preview.png',
  'American': '/food/American_chopsuey-removebg-preview.png',
  'Chopsuey': '/food/American_chopsuey-removebg-preview.png',
  'Lunch': '/food/pulao-removebg-preview.png',
  'Dinner': '/food/Chicken_Karahi-removebg-preview.png',
  'Daily': '/food/pulao-removebg-preview.png',
  'Weekend': '/food/platter-removebg-preview.png',
  'Sunday': '/food/pulao-removebg-preview.png',
  'Budget': '/food/pulao-removebg-preview.png',
  'Couple': '/food/pulao-removebg-preview.png',
  'Special': '/food/tikka-removebg-preview.png',
  'Counter': '/food/platter-removebg-preview.png',
  'Counter Deals': '/food/platter-removebg-preview.png',
  'Solo': '/food/burger-removebg-preview.png',
  'Solo Deals': '/food/burger-removebg-preview.png',
  'Kids': '/food/nuggets-removebg-preview.png',
  'Kids Deals': '/food/nuggets-removebg-preview.png',
  'Super': '/food/platter-removebg-preview.png',
  'Super Deals': '/food/platter-removebg-preview.png',
  'default': '/food/platter-removebg-preview.png'
};

const getCategoryImage = (cat) => {
  if (!cat) return categoryImages.default;
  if (categoryImages[cat]) return categoryImages[cat];
  const lowerCat = cat.toLowerCase();
  for (const key in categoryImages) {
    if (key.toLowerCase() === lowerCat) return categoryImages[key];
  }
  for (const key in categoryImages) {
    if (lowerCat.includes(key.toLowerCase())) return categoryImages[key];
  }
  const words = lowerCat.split(/\s+/);
  for (const word of words) {
    for (const key in categoryImages) {
      if (key.toLowerCase() === word) return categoryImages[key];
    }
  }
  return categoryImages.default;
};

const getCategoryEmoji = (cat) => {
  const emojis = {
    'All': '🍽️', 'Lunch': '🍱', 'Dinner': '🌙', 'Family': '👨‍👩‍👧‍👦',
    'Combo': '🎁', 'BBQ': '🍢', 'Grill': '🔥', 'Special': '⭐',
    'Weekend': '🎉', 'Daily': '📅', 'Budget': '💰', 'Couple': '💑',
    'Party': '🥳', 'Value': '✨', 'Biryani': '🍛', 'Karahi': '🥘',
    'Rice': '🍚', 'Burger': '🍔', 'Pizza': '🍕', 'Dessert': '🍮',
    'Daig': '🥘', 'Pulao': '🍚', 'Tikka': '🍢', 'Kabab': '🍢',
    'Qorma': '🥘', 'Handi': '🥘', 'Raan': '🍖', 'Mutton': '🍖',
    'Chicken': '🍗', 'Fish': '🐟', 'Beverage': '🥤', 'Naan': '🫓',
    'Roll': '🌯', 'Sandwich': '🥪', 'Salad': '🥗', 'Soup': '🍲',
    'Broast': '🍗', 'Wings': '🍗', 'Nuggets': '🍗',
    'Counter': '🏪', 'Solo': '🧑', 'Kids': '🧒', 'Super': '🌟'
  };
  const lowerCat = cat.toLowerCase();
  for (const key in emojis) {
    if (lowerCat.includes(key.toLowerCase())) return emojis[key];
  }
  return '🍽️';
};

const dailySpecials = [
  { day: 'Mon', dish: 'Nihari', price: 450, emoji: '🥘' },
  { day: 'Tue', dish: 'Paya', price: 400, emoji: '🫕' },
  { day: 'Wed', dish: 'Karahi', price: 999, emoji: '🥘' },
  { day: 'Thu', dish: 'Pulao', price: 699, emoji: '🍚' },
  { day: 'Fri', dish: 'Biryani', price: 499, emoji: '🍛' },
  { day: 'Sat', dish: 'BBQ', price: 1299, emoji: '🍢' },
  { day: 'Sun', dish: 'Brunch', price: 799, emoji: '🌅' }
];

const branchDeals = {
  johar: [
    { id: 'jh1', title: 'Johar Lunch Special', price: 799, originalPrice: 1100, tag: 'Popular', items: ['Chicken Biryani', 'Raita', 'Naan (2)', 'Soft Drink'], category: 'Lunch', image: '/catering/pakwan.jpg' },
    { id: 'jh2', title: 'Johar Family Pack', price: 2299, originalPrice: 3000, tag: 'Best Value', items: ['Mutton Biryani', 'Butter Chicken', 'Seekh Kebab (4)', 'Naan (4)', 'Kheer'], category: 'Family', image: '/food/platter.jpg' },
    { id: 'jh3', title: 'Johar Couple Deal', price: 1199, originalPrice: 1550, tag: 'Limited', items: ['Chicken Biryani (2)', 'Malai Boti (4)', 'Naan (2)', 'Gulab Jamun (2)'], category: 'Couple', image: '/catering/pakwan.jpg' },
    { id: 'jh4', title: 'Weekend Johar Feast', price: 1499, originalPrice: 2000, tag: 'Weekend', items: ['Mutton Karahi', 'Reshmi Kebab (4)', 'Roti (4)', 'Lassi (2)', 'Kheer'], category: 'Weekend', image: '/food/Chicken_Karahi.jpg' }
  ],
  gulshan: [
    { id: 'gs1', title: 'Gulshan Express Lunch', price: 749, originalPrice: 1050, tag: 'Quick', items: ['Chicken Pulao', 'Raita', 'Naan (2)', 'Chai'], category: 'Lunch', image: '/food/pulao.jpg' },
    { id: 'gs2', title: 'Gulshan Mega Family', price: 2499, originalPrice: 3300, tag: 'Popular', items: ['Special Biryani', 'Chicken Karahi', 'BBQ Platter', 'Naan (6)', 'Dessert'], category: 'Family', image: '/food/platter.jpg' },
    { id: 'gs3', title: 'Gulshan Duo Deal', price: 1099, originalPrice: 1450, tag: 'Value', items: ['Biryani (2)', 'Chicken Boti (4)', 'Garlic Naan (2)', 'Kulfi (2)'], category: 'Couple', image: '/catering/pakwan.jpg' },
    { id: 'gs4', title: 'Gulshan Sunday Brunch', price: 1399, originalPrice: 1850, tag: 'Sunday', items: ['Halwa Puri', 'Chana', 'Paratha', 'Chai', 'Jalebi'], category: 'Weekend', image: '/food/pulao.jpg' }
  ],
  nagan: [
    { id: 'nk1', title: 'Nagan Daily Special', price: 699, originalPrice: 950, tag: 'Daily', items: ['Chicken Biryani', 'Raita', 'Roti (2)', 'Cold Drink'], category: 'Lunch', image: '/catering/pakwan.jpg' },
    { id: 'nk2', title: 'Nagan Grand Family', price: 2199, originalPrice: 2900, tag: 'Feast', items: ['Mutton Pulao', 'Butter Chicken', 'Seekh Kebab (6)', 'Naan (4)', 'Kheer (4)'], category: 'Family', image: '/food/platter.jpg' },
    { id: 'nk3', title: 'Nagan Budget Combo', price: 999, originalPrice: 1350, tag: 'Budget', items: ['Biryani (2 servings)', 'Chicken Tikka (2)', 'Naan (2)', 'Kulfi'], category: 'Budget', image: '/catering/pakwan.jpg' },
    { id: 'nk4', title: 'Nagan Weekend BBQ', price: 1599, originalPrice: 2100, tag: 'BBQ', items: ['Full BBQ Platter', 'Paratha (4)', 'Raita', 'Lassi (2)'], category: 'BBQ', image: '/food/tikka.jpg' }
  ]
};

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add('vis'); },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}
function Reveal({ children, delay = 0 }) {
  const ref = useReveal();
  return <div ref={ref} className="rv" style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.dp-root {
  min-height: 100vh;
  background: #080808;
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #fff;
  overflow-x: hidden;
}

.rv {
  opacity: 0; transform: translateY(22px);
  transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1);
}
.rv.vis { opacity: 1; transform: none; }

@keyframes fadeUp {
  from { opacity:0; transform:translateY(28px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes pulse-ring {
  0%   { box-shadow: 0 0 0 0 rgba(200,16,46,0.4); }
  70%  { box-shadow: 0 0 0 14px rgba(200,16,46,0); }
  100% { box-shadow: 0 0 0 0 rgba(200,16,46,0); }
}
@keyframes cardEnter {
  from { opacity: 0; transform: translateY(30px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes dp-spin { to { transform: rotate(360deg); } }
@keyframes saveBadgeIn {
  from { transform: scale(0.8) rotate(-6deg); opacity: 0; }
  to   { transform: scale(1) rotate(-2deg); opacity: 1; }
}

/* ══════════ HERO ══════════ */
.dp-hero {
  position: relative; min-height: 500px;
  display: flex; align-items: stretch;
  overflow: hidden;
  background: #080808;
}

/* Left dark panel */
.dp-hero-panel-left {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 130px 48px 64px 80px;
  z-index: 2;
}

/* Right cream panel */
.dp-hero-panel-right {
  width: 380px;
  flex-shrink: 0;
  background: #F5E6C8;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 130px 40px 64px;
  position: relative;
  overflow: hidden;
  z-index: 2;
}
.dp-hero-panel-right::before {
  content: '';
  position: absolute;
  top: -80px; right: -80px;
  width: 300px; height: 300px;
  border-radius: 50%;
  background: rgba(200,16,46,0.06);
  z-index: 0;
}
.dp-hero-panel-right::after {
  content: '';
  position: absolute;
  bottom: -60px; left: -60px;
  width: 250px; height: 250px;
  border-radius: 50%;
  background: rgba(200,16,46,0.04);
  z-index: 0;
}

/* Diagonal separator */
.dp-hero-divider-line {
  position: absolute;
  top: 0; bottom: 0;
  width: 64px;
  background: #F5E6C8;
  clip-path: polygon(60% 0%, 100% 0%, 100% 100%, 0% 100%);
  z-index: 3;
  right: 380px;
}

.dp-hero-bg {
  position: absolute; inset: 0; z-index: 0;
  background:
    radial-gradient(ellipse 60% 80% at 20% 60%, rgba(200,16,46,0.1) 0%, transparent 65%),
    radial-gradient(ellipse 40% 50% at 60% 20%, rgba(0,33,100,0.06) 0%, transparent 50%);
}
.dp-hero-grid {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(245,230,200,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(245,230,200,0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 70% 90% at 30% 60%, black 20%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 70% 90% at 30% 60%, black 20%, transparent 80%);
}
.dp-hero-accent {
  position: absolute; top: 0; left: 0; right: 0; height: 2px; z-index: 5;
  background: linear-gradient(90deg, transparent 0%, #C8102E 25%, #F5E6C8 50%, #C8102E 75%, transparent 100%);
}

.dp-hero-eyebrow {
  display: inline-flex; align-items: center; gap: 10px;
  background: rgba(200,16,46,0.1);
  border: 1px solid rgba(200,16,46,0.2);
  padding: 8px 18px; border-radius: 50px;
  font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase;
  color: #e87a8a; font-weight: 600; margin-bottom: 28px;
  animation: fadeUp 0.7s 0.1s both;
  width: fit-content;
}
.dp-hero-eyebrow-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #C8102E; animation: pulse-ring 2s infinite;
}
.dp-hero-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(38px, 5.5vw, 68px);
  font-weight: 700; line-height: 1.1;
  letter-spacing: -0.025em; color: #fff;
  animation: fadeUp 0.7s 0.2s both;
  margin-bottom: 20px;
}
.dp-hero-title em {
  font-style: italic; font-weight: 400;
  color: #F5E6C8; display: block;
}
.dp-hero-desc {
  font-size: 15px; color: rgba(255,255,255,0.5);
  line-height: 1.8; max-width: 460px;
  animation: fadeUp 0.7s 0.3s both;
}

/* RIGHT PANEL — cream content (Deals unique) */
.dp-hero-cream-label {
  position: relative; z-index: 1;
  font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase;
  color: #C8102E; font-weight: 700; margin-bottom: 20px;
  display: flex; align-items: center; gap: 8px;
  animation: fadeUp 0.7s 0.2s both;
}
.dp-hero-cream-label::before {
  content: ''; width: 20px; height: 1px; background: #C8102E;
}
.dp-hero-savings-card {
  position: relative; z-index: 1;
  background: rgba(200,16,46,0.1);
  border: 1px solid rgba(200,16,46,0.2);
  border-radius: 16px;
  padding: 24px 28px;
  margin-bottom: 16px;
  animation: fadeUp 0.7s 0.25s both;
}
.dp-hero-savings-num {
  font-family: 'Playfair Display', serif;
  font-size: 48px; font-weight: 700;
  color: #C8102E; line-height: 1;
}
.dp-hero-savings-lbl {
  font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
  color: #8C6A3A; font-weight: 600; margin-top: 6px;
}
.dp-hero-stats-row {
  position: relative; z-index: 1;
  display: flex; gap: 12px;
  animation: fadeUp 0.7s 0.35s both;
}
.dp-hero-stat-pill {
  flex: 1;
  background: rgba(42,26,0,0.06);
  border: 1px solid rgba(42,26,0,0.12);
  border-radius: 12px;
  padding: 14px 16px;
  text-align: center;
}
.dp-hero-stat-pill-num {
  font-family: 'Playfair Display', serif;
  font-size: 24px; font-weight: 700;
  color: #2A1A00; line-height: 1;
}
.dp-hero-stat-pill-lbl {
  font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
  color: #8C6A3A; font-weight: 600; margin-top: 4px;
}

/* BRANCHES */
.dp-branches {
  background: #0e0e0e;
  border-top: 1px solid rgba(245,230,200,0.08);
  border-bottom: 1px solid rgba(245,230,200,0.08);
  padding: 24px 0;
}
.dp-branches-header {
  max-width: 1280px; margin: 0 auto 16px; padding: 0 48px;
  display: flex; align-items: center; gap: 14px;
}
.dp-branches-label {
  font-size: 11px; letter-spacing: 0.4em; text-transform: uppercase;
  color: rgba(245,230,200,0.3); font-weight: 600; white-space: nowrap;
}
.dp-branches-line { flex: 1; height: 1px; background: rgba(245,230,200,0.07); }
.dp-branches-inner {
  max-width: 1280px; margin: 0 auto;
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 14px; padding: 0 48px;
}
.dp-branch-tab {
  padding: 20px 22px; background: rgba(245,230,200,0.02);
  border: 1px solid rgba(245,230,200,0.07); border-radius: 14px;
  cursor: pointer; text-align: left; transition: all 0.3s ease;
  position: relative; overflow: hidden;
}
.dp-branch-tab:hover {
  background: rgba(245,230,200,0.05); border-color: rgba(245,230,200,0.15); transform: translateY(-2px);
}
.dp-branch-tab.active {
  background: rgba(245,230,200,0.08); border-color: rgba(245,230,200,0.25);
  box-shadow: 0 6px 24px rgba(0,0,0,0.3);
}
.dp-branch-check {
  position: absolute; top: 10px; right: 10px; width: 20px; height: 20px;
  background: #F5E6C8; border-radius: 50%; display: flex; align-items: center;
  justify-content: center; font-size: 10px; color: #2A1A00;
  opacity: 0; transform: scale(0); transition: all 0.3s ease;
}
.dp-branch-tab.active .dp-branch-check { opacity: 1; transform: scale(1); }
.dp-branch-tag {
  font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase;
  color: rgba(245,230,200,0.5); font-weight: 600; margin-bottom: 6px; display: block;
}
.dp-branch-name {
  font-family: 'Playfair Display', serif; font-size: 17px;
  color: #fff; font-weight: 600; margin-bottom: 4px;
}
.dp-branch-tab.active .dp-branch-name { color: #F5E6C8; }
.dp-branch-addr { font-size: 12px; color: rgba(255,255,255,0.35); }

/* CATEGORIES */
.dp-cats-sec { background: #0a0a0a; padding: 56px 0 0; }
.dp-cats-inner { max-width: 1280px; margin: 0 auto; padding: 0 48px; }
.dp-sec-label {
  font-size: 11px; letter-spacing: 0.4em; text-transform: uppercase;
  color: rgba(245,230,200,0.5); font-weight: 600; display: block; margin-bottom: 10px;
}
.dp-sec-title {
  font-family: 'Playfair Display', serif; font-size: clamp(28px, 4vw, 38px);
  font-weight: 700; color: #fff; line-height: 1.2; margin-bottom: 36px;
}
.dp-sec-title em { font-style: italic; font-weight: 400; color: #F5E6C8; }
.dp-cats-scroll {
  display: flex; gap: 10px; overflow-x: auto;
  padding-bottom: 24px; scrollbar-width: none; cursor: grab;
}
.dp-cats-scroll::-webkit-scrollbar { display: none; }
.dp-cats-scroll:active { cursor: grabbing; }
.dp-cat-pill {
  display: flex; align-items: center; gap: 8px; padding: 10px 18px;
  background: rgba(245,230,200,0.03); border: 1px solid rgba(245,230,200,0.08);
  border-radius: 100px; cursor: pointer;
  transition: all 0.3s cubic-bezier(0.22,1,0.36,1); flex-shrink: 0;
}
.dp-cat-pill:hover { border-color: rgba(245,230,200,0.2); background: rgba(245,230,200,0.06); }
.dp-cat-pill.active { background: #F5E6C8; border-color: #F5E6C8; }
.dp-cat-emoji { font-size: 16px; line-height: 1; }
.dp-cat-name { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.65); letter-spacing: 0.02em; }
.dp-cat-pill.active .dp-cat-name { color: #2A1A00; }
.dp-cat-count {
  font-size: 11px; color: rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.07); padding: 2px 7px; border-radius: 20px;
}
.dp-cat-pill.active .dp-cat-count { background: rgba(200,16,46,0.15); color: #C8102E; }

/* ══════════ CATEGORY IMAGE — FLOATING FOOD ══════════ */
.dp-cat-float-sec {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 48px 20px;
  text-align: center;
}
.dp-cat-float-wrap {
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: min(500px, 90vw);
  min-height: clamp(180px, 35vw, 280px);
  background: radial-gradient(ellipse at center, rgba(245,230,200,0.08) 0%, transparent 70%);
}
.dp-cat-float-img {
  width: 100%;
  height: clamp(180px, 35vw, 280px);
  object-fit: contain;
  object-position: center;
  display: block;
  filter: drop-shadow(0 20px 40px rgba(0,0,0,0.5));
  animation: floatFood 4s ease-in-out infinite;
}
@keyframes floatFood {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(1deg); }
}
.dp-cat-float-name {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.5rem, 3vw, 2rem);
  color: #F5E6C8;
  margin-top: 16px;
  text-shadow: 0 4px 20px rgba(0,0,0,0.5);
}

/* DEALS GRID */
.dp-menu-sec { background: #0a0a0a; padding: 40px 0 100px; }
.dp-menu-inner { max-width: 1280px; margin: 0 auto; padding: 0 48px; }
.dp-menu-header {
  display: flex; align-items: flex-end; justify-content: space-between;
  margin-bottom: 36px; padding-bottom: 20px;
  border-bottom: 1px solid rgba(245,230,200,0.07);
}
.dp-menu-header-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(26px, 3.5vw, 40px); font-weight: 700; color: #fff; line-height: 1.2;
}
.dp-menu-header-sub { font-size: 13px; color: rgba(255,255,255,0.3); margin-top: 4px; }
.dp-total-saved {
  background: rgba(245,230,200,0.06); border: 1px solid rgba(245,230,200,0.12);
  border-radius: 10px; padding: 10px 18px; text-align: right;
}
.dp-total-saved-label {
  font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;
  color: rgba(245,230,200,0.35); font-weight: 600;
}
.dp-total-saved-num {
  font-family: 'Playfair Display', serif; font-size: 22px; color: #F5E6C8; font-weight: 700;
}
.dp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }

/* DEAL CARD */
.dp-card {
  background: #111; border: 1px solid rgba(255,255,255,0.05);
  border-radius: 20px; overflow: hidden;
  transition: all 0.4s cubic-bezier(0.22,1,0.36,1);
  position: relative; animation: cardEnter 0.55s cubic-bezier(0.22,1,0.36,1) backwards;
}
.dp-card::after {
  content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, #F5E6C8, transparent);
  opacity: 0; transition: opacity 0.3s ease;
}
.dp-card:hover::after { opacity: 1; }
.dp-card:hover {
  transform: translateY(-8px); border-color: rgba(245,230,200,0.12);
  box-shadow: 0 24px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,230,200,0.06);
}
.dp-card-body { padding: 24px; }
.dp-card-save-badge {
  position: absolute; top: 16px; right: 16px;
  background: #F5E6C8; color: #C8102E;
  width: 56px; height: 56px; border-radius: 50%;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700; line-height: 1.2; text-align: center;
  box-shadow: 0 4px 14px rgba(0,0,0,0.3);
  animation: saveBadgeIn 0.4s cubic-bezier(0.22,1,0.36,1) backwards;
  transform: rotate(-3deg); z-index: 1;
}
.dp-card-save-badge-amount { font-size: 11px; font-weight: 800; color: #C8102E; }
.dp-card-save-badge-off { font-size: 8px; color: #8C6A3A; text-transform: uppercase; letter-spacing: 0.05em; }
.dp-card-tag {
  display: inline-block; background: rgba(200,16,46,0.15); color: rgba(200,16,46,0.9);
  padding: 4px 10px; border-radius: 4px; font-size: 10px; font-weight: 700;
  letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 14px;
}
.dp-card-title {
  font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 600;
  color: #fff; line-height: 1.3; margin: 0 0 10px 0; padding-right: 64px;
}
.dp-card-price-row {
  display: flex; align-items: center; gap: 10px; margin-bottom: 18px; flex-wrap: wrap;
}
.dp-card-price {
  font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 700; color: #F5E6C8;
}
.dp-card-price span {
  font-size: 13px; font-family: 'Inter', sans-serif;
  font-weight: 500; color: rgba(245,230,200,0.45); margin-right: 2px;
}
.dp-card-original { font-size: 15px; color: rgba(255,255,255,0.3); text-decoration: line-through; }
.dp-card-rule { height: 1px; background: rgba(245,230,200,0.06); margin: 0 0 16px 0; }
.dp-card-items { list-style: none; padding: 0; margin: 0 0 22px 0; }
.dp-card-items li {
  padding: 7px 0; color: rgba(255,255,255,0.5); font-size: 13px; line-height: 1.5;
  display: flex; align-items: center; gap: 10px;
  border-bottom: 1px solid rgba(245,230,200,0.04);
}
.dp-card-items li:last-child { border-bottom: none; }
.dp-item-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(245,230,200,0.3); flex-shrink: 0; }
.dp-btn-order {
  width: 100%; padding: 14px; background: rgba(245,230,200,0.06);
  color: rgba(245,230,200,0.7); border: 1px solid rgba(245,230,200,0.15);
  border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;
  transition: all 0.3s; letter-spacing: 0.02em;
}
.dp-btn-order:hover {
  background: #F5E6C8; border-color: #F5E6C8; color: #2A1A00;
  transform: translateY(-2px); box-shadow: 0 8px 24px rgba(245,230,200,0.15);
}

/* LOADING / EMPTY */
.dp-loading {
  grid-column: 1 / -1; display: flex; flex-direction: column;
  align-items: center; justify-content: center; padding: 80px 20px; gap: 16px;
}
.dp-loading-spinner {
  width: 44px; height: 44px; border: 2px solid rgba(245,230,200,0.1);
  border-top-color: #F5E6C8; border-radius: 50%; animation: dp-spin 1s linear infinite;
}
.dp-loading-text { color: rgba(255,255,255,0.4); font-size: 14px; }
.dp-empty { grid-column: 1 / -1; text-align: center; padding: 80px 20px; color: rgba(255,255,255,0.2); }
.dp-empty-icon { font-size: 44px; margin-bottom: 14px; }
.dp-empty-text { font-size: 15px; }

/* LOAD MORE */
.dp-load-more { grid-column: 1 / -1; display: flex; justify-content: center; margin-top: 40px; }
.dp-load-more-btn {
  padding: 13px 32px; background: rgba(245,230,200,0.06); border: 1px solid rgba(245,230,200,0.15);
  border-radius: 50px; color: rgba(245,230,200,0.7); font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all 0.3s;
}
.dp-load-more-btn:hover:not(:disabled) {
  background: rgba(245,230,200,0.12); color: #F5E6C8; transform: translateY(-2px);
}
.dp-load-more-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* DAILY SPECIALS */
.dp-daily-sec { padding: 72px 0; background: #F5E6C8; }
.dp-daily-inner { max-width: 1280px; margin: 0 auto; padding: 0 48px; }
.dp-daily-sec .dp-sec-label { color: #C8102E; opacity: 1; }
.dp-daily-sec .dp-sec-title { color: #2A1A00; }
.dp-daily-sec .dp-sec-title em { color: #C8102E; }
.dp-daily-grid {
  display: grid; grid-template-columns: repeat(7, 1fr); gap: 14px; margin-top: 36px;
}
.dp-daily-card {
  background: rgba(255,255,255,0.6); border: 1px solid rgba(200,16,46,0.1);
  border-radius: 14px; padding: 22px 14px; text-align: center; transition: all 0.3s; cursor: pointer;
}
.dp-daily-card:hover {
  background: #fff; border-color: rgba(200,16,46,0.25);
  transform: translateY(-4px); box-shadow: 0 8px 20px rgba(200,16,46,0.1);
}
.dp-daily-card.today {
  background: #fff; border-color: #C8102E; box-shadow: 0 6px 20px rgba(200,16,46,0.15);
}
.dp-daily-emoji { font-size: 28px; margin-bottom: 8px; }
.dp-daily-day {
  font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
  color: #8C6A3A; font-weight: 700; margin: 0 0 4px 0;
}
.dp-daily-card.today .dp-daily-day { color: #C8102E; }
.dp-daily-dish { font-size: 13px; font-weight: 600; color: #2A1A00; margin: 0 0 8px 0; }
.dp-daily-price { font-family: 'Playfair Display', serif; font-size: 18px; color: #C8102E; font-weight: 700; }

/* CLOSED BANNER */
.dp-closed-banner {
  position: fixed; top: 80px; left: 0; right: 0;
  background: linear-gradient(90deg, #C8102E, #a00d25); color: #fff;
  padding: 10px 20px; text-align: center; font-weight: 600; font-size: 14px;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  z-index: 998;
  box-shadow: 0 4px 20px rgba(200,16,46,0.4);
}

/* Floating Cart */
.floating-cart-btn {
  position: fixed; bottom: 24px; right: 24px; width: 60px; height: 60px;
  border-radius: 50%; background: linear-gradient(135deg, #C8102E, #a00d25);
  border: none; cursor: pointer; box-shadow: 0 8px 30px rgba(200,16,46,0.4);
  z-index: 1000; display: flex; align-items: center; justify-content: center;
  transition: all 0.3s ease;
}
.floating-cart-btn:hover { transform: scale(1.1); box-shadow: 0 12px 40px rgba(200,16,46,0.5); }
.floating-cart-btn svg { width: 26px; height: 26px; color: white; }
.floating-cart-count {
  position: absolute; top: -4px; right: -4px; background: #F5E6C8; color: #C8102E;
  font-weight: 700; font-size: 12px; width: 24px; height: 24px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

/* RESPONSIVE */
@media (max-width: 1200px) {
  .dp-grid { grid-template-columns: repeat(2, 1fr); }
  .dp-daily-grid { grid-template-columns: repeat(4, 1fr); }
  .dp-hero-panel-right { width: 300px; }
  .dp-hero-divider-line { right: 300px; }
}
@media (max-width: 1024px) {
  .dp-hero-panel-right { display: none; }
  .dp-hero-divider-line { display: none; }
  .dp-hero-panel-left { padding: 110px 40px 64px 60px; }
}
@media (max-width: 768px) {
  .dp-hero-panel-left { padding: 100px 24px 48px 32px; }
}
@media (max-width: 960px) {
  .dp-hero-right { display: none; }
  .dp-branches-inner {
    display: flex; overflow-x: auto; gap: 12px; padding: 0 20px; scrollbar-width: none;
    cursor: grab; user-select: none;
  }
  .dp-branches-inner.dragging { cursor: grabbing; }
  .dp-branches-inner.dragging .dp-branch-tab { pointer-events: none; }
  .dp-branches-inner::-webkit-scrollbar { display: none; }
  .dp-branch-tab { flex: 0 0 240px; min-width: 240px; }
  .dp-branches-header { padding: 0 20px; }
}
@media (max-width: 768px) {
  .dp-hero-inner { grid-template-columns: 1fr; padding: 110px 24px 48px; }
  .dp-cats-inner, .dp-menu-inner, .dp-daily-inner { padding: 0 20px; }
  .dp-menu-header { flex-direction: column; align-items: flex-start; gap: 12px; }
  .dp-grid { grid-template-columns: 1fr; }
  .dp-daily-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .dp-cat-float-sec { padding: 0 16px 16px; }
  .dp-cat-float-wrap { max-width: 100%; min-height: clamp(140px, 40vw, 220px); }
  .dp-cat-float-img { height: clamp(140px, 40vw, 220px); }
  .dp-cat-float-name { font-size: clamp(1.2rem, 4vw, 1.6rem); }
}
`;

export default function DealsPageNew({
  cart, cartCount, cartTotal,
  isCartOpen, setIsCartOpen,
  isOrderModalOpen, setIsOrderModalOpen,
  updateQuantity, removeFromCart, clearCart,
  sendWhatsAppOrder, addToCart
}) {
  const [selectedBranch, setSelectedBranch] = useState('nagan');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAllDaily, setShowAllDaily] = useState(false);
  const [visibleDailyCount, setVisibleDailyCount] = useState(6);
  const [showAllDeals, setShowAllDeals] = useState(false);
  const [visibleDealsCount, setVisibleDealsCount] = useState(6);

  const { deals: apiDeals, categories: apiCategories, loading, error, hasMore, loadMore, isRestaurantOpen: restaurantOpen } = useDealsData(selectedCategory, selectedBranch);

  // Update visible count based on screen size
  useEffect(() => {
    const handleResize = () => {
      setVisibleDailyCount(window.innerWidth <= 768 ? 3 : 6);
      setVisibleDealsCount(window.innerWidth <= 768 ? 3 : 6);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const staticDeals = branchDeals[selectedBranch] || branchDeals.johar;
  const staticCategories = [...new Set(staticDeals.map(d => d.category).filter(Boolean))];
  const deals = apiDeals?.length > 0 ? apiDeals : staticDeals;
  const categories = apiCategories?.length > 0 ? apiCategories : staticCategories;
  const allBranchDeals = apiDeals?.length > 0 ? deals : staticDeals;

  const scrollRef = useRef(null);
  const branchScrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let isDown = false, startX = 0, sl = 0;
    const dn = e => { isDown = true; startX = e.pageX - el.offsetLeft; sl = el.scrollLeft; };
    const up = () => { isDown = false; };
    const mv = e => { if (!isDown) return; e.preventDefault(); el.scrollLeft = sl - (e.pageX - el.offsetLeft - startX) * 1.2; };
    el.addEventListener('mousedown', dn); el.addEventListener('mouseleave', up);
    el.addEventListener('mouseup', up); el.addEventListener('mousemove', mv);
    return () => {
      el.removeEventListener('mousedown', dn); el.removeEventListener('mouseleave', up);
      el.removeEventListener('mouseup', up); el.removeEventListener('mousemove', mv);
    };
  }, []);

  useEffect(() => {
    const el = branchScrollRef.current;
    if (!el) return;
    let isDown = false, startX = 0, sl = 0;
    const dn = e => { isDown = true; el.classList.add('dragging'); startX = (e.pageX || e.touches?.[0]?.pageX) - el.offsetLeft; sl = el.scrollLeft; };
    const up = () => { isDown = false; el.classList.remove('dragging'); };
    const mv = e => { if (!isDown) return; e.preventDefault(); const x = (e.pageX || e.touches?.[0]?.pageX) - el.offsetLeft; el.scrollLeft = sl - (x - startX) * 1.2; };
    el.addEventListener('mousedown', dn); el.addEventListener('mouseleave', up);
    el.addEventListener('mouseup', up); el.addEventListener('mousemove', mv);
    el.addEventListener('touchstart', dn, { passive: false }); el.addEventListener('touchend', up);
    el.addEventListener('touchmove', mv, { passive: false });
    return () => {
      el.removeEventListener('mousedown', dn); el.removeEventListener('mouseleave', up);
      el.removeEventListener('mouseup', up); el.removeEventListener('mousemove', mv);
      el.removeEventListener('touchstart', dn); el.removeEventListener('touchend', up);
      el.removeEventListener('touchmove', mv);
    };
  }, []);

  const countFor = (catId) =>
    catId === 'All' ? allBranchDeals.length : allBranchDeals.filter(d => d.category === catId).length;

  const totalSavings = deals.reduce((acc, d) => acc + ((d.originalPrice || 0) - (d.price || 0)), 0);

  const handleOrderDeal = (deal) => {
    if (!isDealAvailableNow(deal)) {
      if (!restaurantOpen) {
        alert('Restaurant is currently closed. Please order during operating hours:\nMon–Fri: 11AM–1AM\nSat–Sun: 11AM–2AM');
      } else {
        alert('This deal is only available during dinner hours (5 PM - 2 AM)');
      }
      return;
    }
    const dealItem = {
      id: `deal-${deal.id}`,
      name: deal.title, price: deal.price,
      image: deal.image || getCategoryImage(deal.category),
      description: `Includes: ${deal.items.join(', ')}`, quantity: 1
    };
    addToCart(dealItem);
    // Open cart instead of order modal - user can checkout from cart
    setIsCartOpen(true);
  };

  const categoryData = ['All', ...categories.filter(c => c !== 'All')].map(cat => ({
    id: cat, name: cat, emoji: getCategoryEmoji(cat),
  }));


  const todayDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];

  return (
    <div className="dp-root">
      <Navbar />
      <style>{CSS}</style>

      {/* HERO */}
      <section className="dp-hero">
        <div className="dp-hero-bg" />
        <div className="dp-hero-grid" />
        <div className="dp-hero-accent" />
        <div className="dp-hero-divider-line" />

        {/* LEFT — dark panel */}
        <div className="dp-hero-panel-left">
          <div className="dp-hero-eyebrow">
            <span className="dp-hero-eyebrow-dot" />
            Limited Time Offers
          </div>
          <h1 className="dp-hero-title">
            Exclusive
            <em>Deals</em>
          </h1>
          <p className="dp-hero-desc">
            Specially curated meal deals across all 3 Karachi locations. Best value combos for every appetite.
          </p>
        </div>

        {/* RIGHT — cream panel */}
        <div className="dp-hero-panel-right">
          <span className="dp-hero-cream-label">Savings</span>
          <div className="dp-hero-savings-card">
            <div className="dp-hero-savings-num">{deals.length}</div>
            <div className="dp-hero-savings-lbl">Active Deals</div>
          </div>
          <div className="dp-hero-stats-row">
            <div className="dp-hero-stat-pill">
              <div className="dp-hero-stat-pill-num">7</div>
              <div className="dp-hero-stat-pill-lbl">Daily</div>
            </div>
            <div className="dp-hero-stat-pill">
              <div className="dp-hero-stat-pill-num">3</div>
              <div className="dp-hero-stat-pill-lbl">Locations</div>
            </div>
          </div>
        </div>
      {!restaurantOpen && (
        <div className="dp-closed-banner">
          <span>⏰</span>
          <span>Restaurant Closed — Mon–Fri: 11AM–1AM, Sat–Sun: 11AM–2AM</span>
        </div>
      )}

      </section>

      {/* BRANCHES */}
      <nav className="dp-branches">
        <div className="dp-branches-header">
          <span className="dp-branches-label">Select Location</span>
          <span className="dp-branches-line" />
        </div>
        <div className="dp-branches-inner" ref={branchScrollRef}>
          {branches.map((b) => (
            <button
              key={b.id}
              className={`dp-branch-tab${selectedBranch === b.id ? ' active' : ''}`}
              onClick={() => setSelectedBranch(prev => prev === b.id ? 'all' : b.id)}
            >
              <span className="dp-branch-check">✓</span>
              <span className="dp-branch-tag">{b.tag}</span>
              <div className="dp-branch-name">{b.name}</div>
              <div className="dp-branch-addr">{b.address}</div>
            </button>
          ))}
        </div>
      </nav>

      {/* CATEGORIES */}
      <section className="dp-cats-sec">
        <div className="dp-cats-inner">
          <Reveal>
            <span className="dp-sec-label">Filter by</span>
            <h2 className="dp-sec-title">Browse <em>Categories</em></h2>
          </Reveal>
          <div className="dp-cats-scroll" ref={scrollRef}>
            {categoryData.map((cat) => (
              <button
                key={cat.id}
                className={`dp-cat-pill${selectedCategory === cat.id ? ' active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span className="dp-cat-emoji">{cat.emoji}</span>
                <span className="dp-cat-name">{cat.name}</span>
                <span className="dp-cat-count">{countFor(cat.id)}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY IMAGE — FLOATING FOOD */}
      {selectedCategory !== 'All' && (
        <section className="dp-cat-float-sec">
          <div className="dp-cat-float-wrap">
            <img
              src={getCategoryImage(selectedCategory)}
              alt={selectedCategory}
              className="dp-cat-float-img"
            />
          </div>
          <div className="dp-cat-float-name">{selectedCategory}</div>
        </section>
      )}

      {/* DEALS GRID */}
      <section className="dp-menu-sec">
        <div className="dp-menu-inner">
          <Reveal>
            <div className="dp-menu-header">
              <div>
                <div className="dp-menu-header-title">
                  {selectedCategory === 'All' ? 'All Deals' : selectedCategory}
                </div>
                <div className="dp-menu-header-sub">
                  {loading ? 'Loading...' : `${deals.length} deal${deals.length !== 1 ? 's' : ''}`} · {branches.find(b => b.id === selectedBranch)?.name || 'All Locations'}
                </div>
              </div>
              {totalSavings > 0 && (
                <div className="dp-total-saved">
                  <div className="dp-total-saved-label">Total Savings Available</div>
                  <div className="dp-total-saved-num">Rs. {totalSavings.toLocaleString()}</div>
                </div>
              )}
            </div>
          </Reveal>

          <div className="dp-grid">
            {loading && deals.length === 0 ? (
              <div className="dp-loading">
                <div className="dp-loading-spinner" />
                <div className="dp-loading-text">Loading deals...</div>
              </div>
            ) : deals.length === 0 ? (
              <div className="dp-empty">
                <div className="dp-empty-icon">🍽️</div>
                <div className="dp-empty-text">No deals for this selection</div>
              </div>
            ) : (
              (showAllDeals ? deals : deals.slice(0, visibleDealsCount)).map((deal, idx) => {
                const savings = (deal.originalPrice || 0) - (deal.price || 0);
                return (
                  <Reveal key={deal.id} delay={idx * 50}>
                    <div className="dp-card">
                      {savings > 0 && (
                        <div className="dp-card-save-badge">
                          <span className="dp-card-save-badge-amount">
                            Rs.{savings >= 1000 ? `${Math.round(savings / 100) / 10}k` : savings}
                          </span>
                          <span className="dp-card-save-badge-off">off</span>
                        </div>
                      )}
                      <div className="dp-card-body">
                        <div className="dp-card-tag">{deal.tag}</div>
                        <h3 className="dp-card-title">{deal.title}</h3>
                        <div className="dp-card-price-row">
                          <span className="dp-card-price"><span>Rs.</span>{deal.price?.toLocaleString()}</span>
                          <span className="dp-card-original">Rs. {deal.originalPrice?.toLocaleString()}</span>
                        </div>
                        <div className="dp-card-rule" />
                        <ul className="dp-card-items">
                          {deal.items.map((item, i) => (
                            <li key={i}>
                              <span className="dp-item-dot" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <button 
                          className="dp-btn-order" 
                          onClick={() => handleOrderDeal(deal)}
                          disabled={!isDealAvailableNow(deal)}
                          style={!isDealAvailableNow(deal) ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                        >
                          {!restaurantOpen ? 'Closed' : (!isDealAvailableNow(deal) ? '🔒 Dinner Only' : 'Order This Deal →')}
                        </button>
                      </div>
                    </div>
                  </Reveal>
                );
              })
            )}
          </div>

          {hasMore && (
            <div className="dp-load-more">
              <button className="dp-load-more-btn" onClick={loadMore} disabled={loading}>
                {loading ? 'Loading...' : 'Load More Deals'}
              </button>
            </div>
          )}
          {!hasMore && deals.length > visibleDealsCount && (
            <div className="dp-show-more-wrap" style={{marginTop: '32px', textAlign: 'center'}}>
              <button className="dp-show-more-btn" onClick={() => setShowAllDeals(!showAllDeals)}>
                {showAllDeals ? <>Show Less ↑</> : <>Show {deals.length - visibleDealsCount} More ↓</>}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* DAILY SPECIALS */}
      {/* <section className="dp-daily-sec">
        <div className="dp-daily-inner">
          <Reveal>
            <span className="dp-sec-label">Every Day</span>
            <h2 className="dp-sec-title">Daily <em>Specials</em></h2>
          </Reveal>
          <div className="dp-daily-grid">
            {(showAllDaily ? dailySpecials : dailySpecials.slice(0, visibleDailyCount)).map((special) => (
              <div key={special.day} className={`dp-daily-card${special.day === todayDay ? ' today' : ''}`}>
                <div className="dp-daily-emoji">{special.emoji}</div>
                <p className="dp-daily-day">{special.day === todayDay ? `${special.day} · Today` : special.day}</p>
                <p className="dp-daily-dish">{special.dish}</p>
                <p className="dp-daily-price">Rs. {special.price}</p>
              </div>
            ))}
          </div>
          {dailySpecials.length > visibleDailyCount && (
            <div className="dp-show-more-wrap" style={{marginTop: '24px', textAlign: 'center'}}>
              <button className="dp-show-more-btn" onClick={() => setShowAllDaily(!showAllDaily)}>
                {showAllDaily ? <>Show Less ↑</> : <>Show {dailySpecials.length - visibleDailyCount} More ↓</>}
              </button>
            </div>
          )}
        </div>
      </section> */}

      <Cart
        cart={cart} cartCount={cartCount} cartTotal={cartTotal}
        isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen}
        updateQuantity={updateQuantity} removeFromCart={removeFromCart}
        clearCart={clearCart} setIsOrderModalOpen={setIsOrderModalOpen}
        scrollToSection={() => setIsCartOpen(false)}
      />
      <FloatingCartButton cartCount={cartCount} setIsCartOpen={setIsCartOpen} />
      <OrderModal
        cart={cart} cartTotal={cartTotal}
        isOrderModalOpen={isOrderModalOpen} setIsOrderModalOpen={setIsOrderModalOpen}
        sendWhatsAppOrder={sendWhatsAppOrder}
      />
    </div>
  );
}