import { useState, useRef, useEffect } from 'react';
import Cart from '../components/Cart';
import OrderModal from '../components/OrderModal';
import FloatingCartButton from '../components/FloatingCartButton';
import Navbar from '../components/Navbar';
import { useMenuData, isItemAvailableNow } from '../hooks/useMenuData';

const branches = [
  { id: 'Nagan', name: 'Nagan Head Office', address: 'Nagan Chowrangi, Karachi', phone: '+92-300-1234569', tag: 'Head Office' },
  { id: 'Gulshan', name: 'Gulshan Campus', address: 'Gulshan-e-Iqbal, Karachi', phone: '+92-300-1234568', tag: 'Central' },
  { id: 'Jauhar', name: 'Jauhar Campus', address: 'Gulistan-e-Jauhar, Karachi', phone: '+92-300-1234567', tag: 'Main' },
];

const categoryImages = {
  'All': '/food/pulao-removebg-preview.png',
  'BBQ': '/food/kabab-removebg-preview.png',
  'Biryani': '/food/pakwan-removebg-preview.png',
  'Burger': '/food/burger-removebg-preview.png',
  'Karahi': '/food/Chicken_Karahi-removebg-preview.png',
  'Handi': '/food/handi-removebg-preview.png',
  'Rice': '/food/chinese_rice_with_sashlik-removebg-preview.png',
  'Chinese': '/food/chinese_rice_with_sashlik-removebg-preview.png',
  'Pizza': '/food/pizza-removebg-preview.png',
  'Broast': '/food/broast-removebg-preview.png',
  'Dessert': '/food/kheer-removebg-preview.png',
  'Beverages': '/food/cold-can-stands-against-red-droplets-hinting-frosty-touch-removebg-preview.png',
  'Drinks': '/food/cold-can-stands-against-red-droplets-hinting-frosty-touch-removebg-preview.png',
  'Sandwich': '/food/sandwhich-removebg-preview.png',
  'Platter': '/food/platter-removebg-preview.png',
  'Roll': '/food/roll-removebg-preview.png',
  'Rolls': '/food/roll-removebg-preview.png',
  'Fish': '/food/fish_finger-removebg-preview.png',
  'Daal': '/food/daal-removebg-preview.png',
  'Vegetable': '/food/sabzi-removebg-preview.png',
  'Vegetables': '/food/sabzi-removebg-preview.png',
  'Kabab': '/food/kabab-removebg-preview.png',
  'Tikka': '/food/tikka-removebg-preview.png',
  'Wings': '/food/wings-removebg-preview.png',
  'Nuggets': '/food/nuggets-removebg-preview.png',
  'Tandoor': '/food/naan-removebg-preview.png',
  'Paratha': '/food/naan-removebg-preview.png',
  'Pulao': '/food/pulao-removebg-preview.png',
  'Pasta': '/food/chinese_rice_with_sashlik-removebg-preview.png',
  'Noodles': '/food/chopsuey-removebg-preview.png',
  'Chopsuey': '/food/chopsuey-removebg-preview.png',
  'CHOPSUEY': '/food/chopsuey-removebg-preview.png',
  'Salad': '/food/salad.webp',
  'Special Cuisine': '/food/brain_masala-removebg-preview.png',
  'SPECIAL CUISINE': '/food/brain_masala-removebg-preview.png',
  'Ice Cream': '/food/kheer-removebg-preview.png',
  'Sweets': '/food/kheer-removebg-preview.png',
  'BOTI ITEMS': '/food/Afghani_Boti-removebg-preview.png',
  'APPETIZERS': '/food/chicken_strips-removebg-preview.png',
  'AL HAAJ SPECIAL': '/food/platter-removebg-preview.png',
  'CHARGHA': '/food/chargha-removebg-preview.png',
  'DUMPLINGS': '/food/Dumpling-removebg-preview.png',
  'EXTRA ITEMS': '/food/naan-removebg-preview.png',
  'EXTRA TOPPINGS': '/food/naan-removebg-preview.png',
  'FASTFOOD': '/food/broast-removebg-preview.png',
  'Fastfood': '/food/broast-removebg-preview.png',
  'Fast Food': '/food/broast-removebg-preview.png',
  'FastFood': '/food/broast-removebg-preview.png',
  'FRIES': '/food/fries-removebg-preview.png',
  'FRIES FULL PLATE': '/food/fries-removebg-preview.png',
  'Pizza Fries': '/food/fries-removebg-preview.png',
  'PIZZA FRIES': '/food/fries-removebg-preview.png',
  'Counter Items': '/food/platter-removebg-preview.png',
  'COUNTER ITEMS': '/food/platter-removebg-preview.png',
  'Italian Cuisine': '/food/chinese_rice_with_sashlik-removebg-preview.png',
  'ITALIAN CUISINE': '/food/chinese_rice_with_sashlik-removebg-preview.png',
  'Chopsuey': '/food/American_chopsuey-removebg-preview.png',
  'CHOPSUEY': '/food/American_chopsuey-removebg-preview.png',
  'Miscellaneous': '/food/pulao-removebg-preview.png',
  'MISCELLANEOUS': '/food/pulao-removebg-preview.png',
  'Starters': '/food/chicken_strips-removebg-preview.png',
  'STARTERS': '/food/chicken_strips-removebg-preview.png',
  'Wraps': '/food/roll-removebg-preview.png',
  'WRAPS': '/food/roll-removebg-preview.png',
  'Zinger': '/food/burger-removebg-preview.png',
  'ZINGER': '/food/burger-removebg-preview.png',
  'Pakistani Cuisine': '/food/daal-removebg-preview.png',
  'PAKISTANI CUISINE': '/food/daal-removebg-preview.png',
  'Soup': '/food/soup-removebg-preview.png'
};

const getCategoryImage = (cat) => {
  if (categoryImages[cat]) return categoryImages[cat];
  for (const key in categoryImages) {
    if (cat.toLowerCase().includes(key.toLowerCase())) return categoryImages[key];
  }
  return '/food/pulao.jpg';
};

const getCategoryEmoji = (cat) => {
  const emojis = {
    'All': '🍽️', 'Breakfast': '🌅', 'Lunch': '🍱', 'Dinner': '🌙',
    'Rice': '🍛', 'Main': '🥘', 'BBQ': '🍢', 'Bread': '🫓',
    'Side': '🥗', 'Dessert': '🍮', 'Drink': '🥤', 'Beverage': '🥤',
    'Counter': '🏪', 'Solo': '🧑', 'Kids': '🧒', 'Super': '🌟',
    'Biryani': '🍛', 'Burger': '🍔', 'Pizza': '🍕', 'Karahi': '🥘',
    'Chinese': '🥡', 'Sandwich': '🥪', 'Roll': '🌯', 'Noodles': '🍜',
    'Ice Cream': '🍦', 'Soup': '🍲', 'Salad': '🥗', 'Broast': '🍗',
    'Pasta': '🍝', 'Noodles': '🍜'
  };
  for (const key in emojis) {
    if (cat.toLowerCase().includes(key.toLowerCase())) return emojis[key];
  }
  return '🍽️';
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
  return (
    <div ref={ref} className="rv" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─── CREAM PALETTE ───
   Main cream:   #F5E6C8   (warm parchment)
   Deep cream:   #E8D5A3   (golden wheat)
   Cream text:   #2A1A00   (dark espresso on cream)
   Cream muted:  #8C6A3A   (warm brown)
─────────────────────── */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.mp-root {
  min-height: 100vh;
  background: #080808;
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #fff;
  overflow-x: hidden;
}

.rv {
  opacity: 0;
  transform: translateY(22px);
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
  from { opacity: 0; transform: translateY(30px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes mp-spin { to { transform: rotate(360deg); } }
@keyframes shimmerCream {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
@keyframes creamPulse {
  0%,100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* ══════════ HERO ══════════ */
.mp-hero {
  position: relative;
  min-height: 500px;
  display: flex;
  align-items: stretch;
  overflow: hidden;
  background: #080808;
}

/* Left dark panel */
.mp-hero-panel-left {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 130px 48px 64px 80px;
  z-index: 2;
}

/* Right cream panel */
.mp-hero-panel-right {
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
.mp-hero-panel-right::before {
  content: '';
  position: absolute;
  top: -80px; right: -80px;
  width: 300px; height: 300px;
  border-radius: 50%;
  background: rgba(200,16,46,0.06);
  z-index: 0;
}
.mp-hero-panel-right::after {
  content: '';
  position: absolute;
  bottom: -60px; left: -60px;
  width: 250px; height: 250px;
  border-radius: 50%;
  background: rgba(200,16,46,0.04);
  z-index: 0;
}

/* Diagonal separator */
.mp-hero-divider-line {
  position: absolute;
  top: 0; bottom: 0;
  width: 64px;
  background: #F5E6C8;
  clip-path: polygon(60% 0%, 100% 0%, 100% 100%, 0% 100%);
  z-index: 3;
  right: 380px;
}

.mp-hero-bg {
  position: absolute; inset: 0; z-index: 0;
  background:
    radial-gradient(ellipse 60% 80% at 20% 60%, rgba(200,16,46,0.1) 0%, transparent 65%),
    radial-gradient(ellipse 40% 50% at 60% 20%, rgba(0,33,100,0.06) 0%, transparent 50%);
}
.mp-hero-grid {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(245,230,200,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(245,230,200,0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 70% 90% at 30% 60%, black 20%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 70% 90% at 30% 60%, black 20%, transparent 80%);
}
.mp-hero-accent {
  position: absolute; top: 0; left: 0; right: 0; height: 2px; z-index: 5;
  background: linear-gradient(90deg, transparent 0%, #C8102E 25%, #F5E6C8 50%, #C8102E 75%, transparent 100%);
}

.mp-hero-eyebrow {
  display: inline-flex; align-items: center; gap: 10px;
  background: rgba(200,16,46,0.1);
  border: 1px solid rgba(200,16,46,0.2);
  padding: 8px 18px; border-radius: 50px;
  font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase;
  color: #e87a8a; font-weight: 600; margin-bottom: 28px;
  animation: fadeUp 0.7s 0.1s both;
  width: fit-content;
}
.mp-hero-eyebrow-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #C8102E; animation: pulse-ring 2s infinite;
}
.mp-hero-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(38px, 5.5vw, 68px);
  font-weight: 700; line-height: 1.1;
  letter-spacing: -0.025em; color: #fff;
  animation: fadeUp 0.7s 0.2s both;
  margin-bottom: 20px;
}
.mp-hero-title em {
  font-style: italic; font-weight: 400;
  color: #F5E6C8; display: block;
}
.mp-hero-desc {
  font-size: 15px; color: rgba(255,255,255,0.5);
  line-height: 1.8; max-width: 460px;
  animation: fadeUp 0.7s 0.3s both;
}

/* RIGHT PANEL — cream content */
.mp-hero-cream-label {
  position: relative; z-index: 1;
  font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase;
  color: #C8102E; font-weight: 700; margin-bottom: 20px;
  display: flex; align-items: center; gap: 8px;
  animation: fadeUp 0.7s 0.2s both;
}
.mp-hero-cream-label::before {
  content: ''; width: 20px; height: 1px; background: #C8102E;
}
.mp-hero-stats-list {
  position: relative; z-index: 1;
  display: flex; flex-direction: column; gap: 20px;
  animation: fadeUp 0.7s 0.3s both;
}
.mp-hero-stat-item {
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(42,26,0,0.1);
}
.mp-hero-stat-item:last-child { border-bottom: none; padding-bottom: 0; }
.mp-hero-stat-num {
  font-family: 'Playfair Display', serif;
  font-size: 44px; font-weight: 700;
  color: #C8102E; line-height: 1;
}
.mp-hero-stat-lbl {
  font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
  color: #8C6A3A; font-weight: 600; margin-top: 4px;
}
.mp-hero-cream-badge {
  position: relative; z-index: 1;
  margin-top: 28px;
  background: rgba(200,16,46,0.1);
  border: 1px solid rgba(200,16,46,0.2);
  border-radius: 10px; padding: 14px 16px;
  animation: fadeUp 0.7s 0.4s both;
}
.mp-hero-cream-badge-title {
  font-size: 11px; font-weight: 700; color: #C8102E;
  letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px;
}
.mp-hero-cream-badge-text {
  font-size: 13px; color: #5a3a1a; line-height: 1.5;
}

/* ══════════ BRANCHES ══════════ */
.mp-branches {
  background: #F5E6C8;
  padding: 0;
}
.mp-branches-header {
  max-width: 1280px; margin: 0 auto;
  padding: 28px 48px 16px;
  display: flex; align-items: center; gap: 16px;
}
.mp-branches-label {
  font-size: 11px; letter-spacing: 0.4em; text-transform: uppercase;
  color: #8C6A3A; font-weight: 700; white-space: nowrap;
}
.mp-branches-line {
  flex: 1; height: 1px; background: rgba(200,16,46,0.2);
}
.mp-branches-inner {
  max-width: 1280px; margin: 0 auto;
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 16px; padding: 0 48px 28px;
}
.mp-branch-tab {
  padding: 22px 24px;
  background: rgba(255,255,255,0.5);
  border: 2px solid rgba(200,16,46,0.12);
  border-radius: 14px; cursor: pointer; text-align: left;
  transition: all 0.3s ease; position: relative; overflow: hidden;
}
.mp-branch-tab:hover {
  background: rgba(255,255,255,0.8);
  border-color: rgba(200,16,46,0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(200,16,46,0.1);
}
.mp-branch-tab.active {
  background: #fff;
  border-color: #C8102E;
  box-shadow: 0 8px 28px rgba(200,16,46,0.18);
}
.mp-branch-check {
  position: absolute; top: 10px; right: 10px;
  width: 22px; height: 22px;
  background: #C8102E; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; color: #fff;
  opacity: 0; transform: scale(0); transition: all 0.3s ease;
}
.mp-branch-tab.active .mp-branch-check { opacity: 1; transform: scale(1); }
.mp-branch-tag {
  font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase;
  color: #C8102E; font-weight: 700; margin-bottom: 6px; display: block;
}
.mp-branch-name {
  font-family: 'Playfair Display', serif;
  font-size: 18px; color: #2A1A00; font-weight: 600; margin-bottom: 4px;
}
.mp-branch-addr { font-size: 12px; color: #8C6A3A; }

/* ══════════ CATEGORIES ══════════ */
.mp-cats-sec { background: #0a0a0a; padding: 60px 0 0; }
.mp-cats-inner { max-width: 1280px; margin: 0 auto; padding: 0 48px; }
.mp-sec-label {
  font-size: 11px; letter-spacing: 0.4em; text-transform: uppercase;
  color: #F5E6C8; font-weight: 600; display: block; margin-bottom: 10px;
  opacity: 0.7;
}
.mp-sec-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(28px, 4vw, 38px); font-weight: 700;
  color: #fff; line-height: 1.2; margin-bottom: 36px;
}
.mp-sec-title em { font-style: italic; font-weight: 400; color: #F5E6C8; }

.mp-cats-scroll {
  display: flex; gap: 10px; overflow-x: auto;
  padding-bottom: 24px; scrollbar-width: none; cursor: grab;
}
.mp-cats-scroll::-webkit-scrollbar { display: none; }
.mp-cats-scroll:active { cursor: grabbing; }

.mp-cat-pill {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 18px;
  background: rgba(245,230,200,0.04);
  border: 1px solid rgba(245,230,200,0.1);
  border-radius: 100px; cursor: pointer;
  transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
  flex-shrink: 0; position: relative; overflow: hidden;
}
.mp-cat-pill:hover {
  border-color: rgba(245,230,200,0.3);
  background: rgba(245,230,200,0.08);
}
.mp-cat-pill.active {
  background: #F5E6C8;
  border-color: #F5E6C8;
}
.mp-cat-emoji { font-size: 16px; line-height: 1; }
.mp-cat-name {
  font-size: 13px; font-weight: 600;
  color: rgba(255,255,255,0.7); letter-spacing: 0.02em;
}
.mp-cat-pill.active .mp-cat-name { color: #2A1A00; }
.mp-cat-count {
  font-size: 11px; color: rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.08);
  padding: 2px 7px; border-radius: 20px;
}
.mp-cat-pill.active .mp-cat-count {
  background: rgba(200,16,46,0.15); color: #C8102E;
}

/* ══════════ CATEGORY IMAGE — FLOATING FOOD ══════════ */
.mp-cat-float-sec {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 48px 20px;
  text-align: center;
}
.mp-cat-float-wrap {
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: min(500px, 90vw);
  min-height: clamp(180px, 35vw, 280px);
  background: radial-gradient(ellipse at center, rgba(245,230,200,0.08) 0%, transparent 70%);
}
.mp-cat-float-img {
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
.mp-cat-float-name {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.5rem, 3vw, 2rem);
  color: #F5E6C8;
  margin-top: 16px;
  text-shadow: 0 4px 20px rgba(0,0,0,0.5);
}

/* ══════════ MENU GRID ══════════ */
.mp-menu-sec { background: #0a0a0a; padding: 40px 0 120px; }
.mp-menu-inner { max-width: 1280px; margin: 0 auto; padding: 0 48px; }
.mp-menu-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 36px; padding-bottom: 20px;
  border-bottom: 1px solid rgba(245,230,200,0.08);
}
.mp-menu-header-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(26px, 3.5vw, 40px); font-weight: 700;
  color: #fff; line-height: 1.2;
}
.mp-menu-header-sub {
  font-size: 13px; color: rgba(255,255,255,0.3);
  margin-top: 4px;
}
.mp-filter-row { display: flex; gap: 8px; }
.mp-filter-btn {
  padding: 8px 16px; background: transparent;
  border: 1px solid rgba(245,230,200,0.12);
  border-radius: 6px; color: rgba(255,255,255,0.4);
  font-size: 12px; font-weight: 600; letter-spacing: 0.06em;
  cursor: pointer; transition: all 0.25s ease;
}
.mp-filter-btn:hover { border-color: rgba(245,230,200,0.3); color: #F5E6C8; }
.mp-filter-btn.active {
  background: rgba(245,230,200,0.1);
  border-color: rgba(245,230,200,0.3); color: #F5E6C8;
}

.mp-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

/* CARD — cream accent design */
.mp-card {
  background: #111;
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 18px; overflow: hidden;
  transition: all 0.4s cubic-bezier(0.22,1,0.36,1);
  position: relative;
  animation: cardEnter 0.5s cubic-bezier(0.22,1,0.36,1) backwards;
}
/* cream top accent strip */
.mp-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, #F5E6C8, transparent);
  opacity: 0; transition: opacity 0.3s ease;
}
.mp-card:hover::before { opacity: 1; }
.mp-card:hover {
  transform: translateY(-7px);
  border-color: rgba(245,230,200,0.15);
  box-shadow: 0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,230,200,0.08);
}

.mp-card-body { padding: 22px; }

.mp-card-top {
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 8px; margin-bottom: 10px;
}
.mp-card-popular-tag {
  display: inline-block;
  background: rgba(245,230,200,0.12);
  border: 1px solid rgba(245,230,200,0.2);
  color: #F5E6C8; padding: 3px 9px; border-radius: 4px;
  font-size: 10px; font-weight: 700; letter-spacing: 0.06em;
  text-transform: uppercase;
}
.mp-card-cat {
  font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
  color: rgba(245,230,200,0.4); font-weight: 600; margin-bottom: 6px;
}
.mp-card-name {
  font-family: 'Playfair Display', serif;
  font-size: 19px; font-weight: 600; color: #fff;
  line-height: 1.3; margin-bottom: 8px;
}
.mp-card-desc {
  font-size: 13px; color: rgba(255,255,255,0.4);
  line-height: 1.7; margin: 0 0 20px 0;
}
.mp-card-rule {
  height: 1px; background: rgba(245,230,200,0.06); margin: 0 0 18px 0;
}
.mp-card-footer {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
}
.mp-card-price {
  font-family: 'Playfair Display', serif;
  font-size: 23px; font-weight: 700; color: #F5E6C8; line-height: 1;
}
.mp-card-price span {
  font-size: 11px; font-family: 'Inter', sans-serif;
  font-weight: 500; color: rgba(245,230,200,0.4); margin-right: 2px;
}
.mp-card-add {
  width: 38px; height: 38px; border-radius: 10px;
  background: rgba(245,230,200,0.08);
  border: 1px solid rgba(245,230,200,0.15);
  color: #F5E6C8; font-size: 20px; font-weight: 300;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all 0.25s cubic-bezier(0.22,1,0.36,1); flex-shrink: 0; line-height: 1;
}
.mp-card-add:hover {
  background: #F5E6C8; border-color: #F5E6C8;
  color: #2A1A00; transform: scale(1.1) rotate(90deg);
}
.mp-card-add.added {
  background: #F5E6C8; border-color: #F5E6C8; color: #2A1A00;
  animation: pulse-ring 0.5s ease;
}
.mp-card-add.disabled {
  background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.2); cursor: not-allowed;
}

/* ══════════ LOADING / EMPTY ══════════ */
.mp-loading {
  grid-column: 1 / -1; display: flex; flex-direction: column;
  align-items: center; justify-content: center; padding: 80px 20px; gap: 16px;
}
.mp-loading-spinner {
  width: 44px; height: 44px;
  border: 2px solid rgba(245,230,200,0.12);
  border-top-color: #F5E6C8;
  border-radius: 50%; animation: mp-spin 1s linear infinite;
}
.mp-loading-spinner-small {
  width: 22px; height: 22px;
  border: 2px solid rgba(245,230,200,0.12);
  border-top-color: #F5E6C8;
  border-radius: 50%; animation: mp-spin 1s linear infinite;
}
.mp-loading-text { color: rgba(255,255,255,0.4); font-size: 14px; }
.mp-loading-more {
  grid-column: 1 / -1; display: flex; align-items: center;
  justify-content: center; gap: 12px; padding: 20px;
  color: rgba(255,255,255,0.4); font-size: 13px;
}
.mp-empty { grid-column: 1 / -1; text-align: center; padding: 80px 20px; color: rgba(255,255,255,0.2); }
.mp-empty-icon { font-size: 44px; margin-bottom: 14px; }
.mp-empty-text { font-size: 15px; }

/* ══════════ CLOSED BANNER ══════════ */
.mp-closed-banner {
  position: fixed; top: 80px; left: 0; right: 0;
  background: linear-gradient(90deg, #C8102E, #a00d25);
  color: white; padding: 10px 20px;
  text-align: center; font-weight: 600; font-size: 14px;
  z-index: 998; display: flex; align-items: center;
  justify-content: center; gap: 12px;
  box-shadow: 0 4px 20px rgba(200,16,46,0.4);
}

/* Floating Cart */
.floating-cart-btn {
  position: fixed; bottom: 24px; right: 24px;
  width: 60px; height: 60px; border-radius: 50%;
  background: linear-gradient(135deg, #C8102E, #a00d25);
  border: none; cursor: pointer;
  box-shadow: 0 8px 30px rgba(200,16,46,0.4);
  z-index: 1000; display: flex; align-items: center; justify-content: center;
  transition: all 0.3s ease;
}
.floating-cart-btn:hover { transform: scale(1.1); box-shadow: 0 12px 40px rgba(200,16,46,0.5); }
.floating-cart-btn svg { width: 26px; height: 26px; color: white; }
.floating-cart-count {
  position: absolute; top: -4px; right: -4px;
  background: #F5E6C8; color: #C8102E;
  font-weight: 700; font-size: 12px;
  width: 24px; height: 24px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

/* ══════════ RESPONSIVE ══════════ */
@media (max-width: 1200px) {
  .mp-grid { grid-template-columns: repeat(3, 1fr); }
  .mp-hero-panel-right { width: 300px; }
  .mp-hero-divider-line { right: 300px; }
}
@media (max-width: 1024px) {
  .mp-hero-panel-right { display: none; }
  .mp-hero-divider-line { display: none; }
  .mp-hero-panel-left { padding: 110px 40px 64px 60px; }
  .mp-grid { grid-template-columns: repeat(2, 1fr); }
  .mp-branches-inner {
    display: flex; overflow-x: auto; gap: 12px;
    padding: 0 20px 20px; scrollbar-width: none;
    cursor: grab; user-select: none;
  }
  .mp-branches-inner.dragging { cursor: grabbing; }
  .mp-branches-inner.dragging .mp-branch-tab { pointer-events: none; }
  .mp-branches-inner::-webkit-scrollbar { display: none; }
  .mp-branch-tab { flex: 0 0 240px; min-width: 240px; }
  .mp-branches-header { padding: 20px 20px 12px; }
}
@media (max-width: 768px) {
  .mp-hero-panel-left { padding: 100px 24px 48px 32px; }
  .mp-cats-inner, .mp-menu-inner { padding: 0 20px; }
  .mp-menu-header { flex-direction: column; align-items: flex-start; gap: 12px; }
  .mp-cat-float-sec { padding: 0 16px 16px; }
  .mp-cat-float-wrap { max-width: 100%; min-height: clamp(140px, 40vw, 220px); }
  .mp-cat-float-img { height: clamp(140px, 40vw, 220px); }
  .mp-cat-float-name { font-size: clamp(1.2rem, 4vw, 1.6rem); }
}
@media (max-width: 520px) {
  .mp-grid { grid-template-columns: 1fr; }
  .mp-filter-row { flex-wrap: wrap; }
}

/* Show More Button */
.mp-show-more-wrap { text-align: center; margin: 32px 0; }
.mp-show-more-btn {
  background: rgba(245,230,200,0.08);
  border: 1px solid rgba(245,230,200,0.15);
  border-radius: 50px;
  color: rgba(245,230,200,0.7);
  padding: 12px 28px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.mp-show-more-btn:hover {
  background: rgba(245,230,200,0.15);
  border-color: rgba(245,230,200,0.25);
  color: #F5E6C8;
}
`;

export default function MenuPageNew({
  cart, cartCount, cartTotal, isCartOpen, setIsCartOpen,
  isOrderModalOpen, setIsOrderModalOpen, updateQuantity,
  removeFromCart, clearCart, sendWhatsAppOrder, addToCart,
}) {
  const [selectedBranch, setSelectedBranch] = useState('Nagan');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showPopular, setShowPopular] = useState(false);
  const [addedId, setAddedId] = useState(null);
  const [showAllItems, setShowAllItems] = useState(false);
  const [visibleItemCount, setVisibleItemCount] = useState(6);

  const scrollRef = useRef(null);
  const branchesRef = useRef(null);
  const loadMoreRef = useRef(null);

  // Update visible count based on screen size - PC: 8 items, Mobile: 6 items
  useEffect(() => {
    const handleResize = () => {
      setVisibleItemCount(window.innerWidth <= 768 ? 6 : 8);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset show all when category changes
  useEffect(() => {
    setShowAllItems(false);
  }, [selectedCategory, selectedBranch]);

  const {
    items: menuItems, categories: dynamicCategories,
    loading, error, hasMore, loadMore, totalCount, isRestaurantOpen, refresh, allItems
  } = useMenuData(selectedCategory, selectedBranch);


  const categoryData = ['All', ...dynamicCategories.filter(c => c !== 'All')].map(cat => ({
    id: cat, name: cat, emoji: getCategoryEmoji(cat),
  }));

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let isDown = false, startX = 0, sl = 0;
    const dn = e => { isDown = true; startX = e.pageX - el.offsetLeft; sl = el.scrollLeft; };
    const up = () => { isDown = false; };
    const mv = e => { if (!isDown) return; e.preventDefault(); el.scrollLeft = sl - (e.pageX - el.offsetLeft - startX) * 1.2; };
    el.addEventListener('mousedown', dn); el.addEventListener('mouseleave', up);
    el.addEventListener('mouseup', up); el.addEventListener('mousemove', mv);
    return () => { el.removeEventListener('mousedown', dn); el.removeEventListener('mouseleave', up); el.removeEventListener('mouseup', up); el.removeEventListener('mousemove', mv); };
  }, []);

  useEffect(() => {
    const el = branchesRef.current;
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

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting && hasMore && !loading) loadMore(); },
      { threshold: 0.1 }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  const handleAdd = (item) => {
    addToCart(item);
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 600);
  };

  let filtered = menuItems;
  if (showPopular) filtered = filtered.filter(i => i.popular);

  const countFor = (catId) => {
    const branchItems = allItems?.filter(item =>
      selectedBranch === 'all' ||
      item.branches?.includes('all') ||
      item.branches?.some(b => b.toLowerCase() === selectedBranch.toLowerCase())
    ) || [];
    return catId === 'All' ? branchItems.length : branchItems.filter(i => i.category === catId).length;
  };

  return (
    <>
      <Navbar />
      {!isRestaurantOpen && (
        <div className="mp-closed-banner">
          <span>⏰</span>
          <span>Restaurant Closed — Opens at 11:00 AM</span>
        </div>
      )}
      <div className="mp-root">
        <style>{CSS}</style>

        {/* ══════════ HERO ══════════ */}
        <section className="mp-hero">
          <div className="mp-hero-bg" />
          <div className="mp-hero-grid" />
          <div className="mp-hero-accent" />
          <div className="mp-hero-divider-line" />

          {/* LEFT — dark */}
          <div className="mp-hero-panel-left">
            <div className="mp-hero-eyebrow">
              <div className="mp-hero-eyebrow-dot" />
              Est. 1971 · Karachi's Finest
            </div>
            <h1 className="mp-hero-title">
              Our Full
              <em>Menu</em>
            </h1>
            <p className="mp-hero-desc">
              Authentic Pakistani cuisine crafted from time-honoured recipes — available across all three Karachi locations.
            </p>
          </div>

          {/* RIGHT — cream panel */}
          <div className="mp-hero-panel-right">
            <span className="mp-hero-cream-label">At a Glance</span>
            <div className="mp-hero-stats-list">
              <div className="mp-hero-stat-item">
                <div className="mp-hero-stat-num">{loading ? '—' : '938'}</div>
                <div className="mp-hero-stat-lbl">Menu Items</div>
              </div>
              <div className="mp-hero-stat-item">
                <div className="mp-hero-stat-num">3</div>
                <div className="mp-hero-stat-lbl">Locations</div>
              </div>
              <div className="mp-hero-stat-item">
                <div className="mp-hero-stat-num">50+</div>
                <div className="mp-hero-stat-lbl">Years Legacy</div>
              </div>
            </div>
            <div className="mp-hero-cream-badge">
              <div className="mp-hero-cream-badge-title">Opening Hours</div>
              <div className="mp-hero-cream-badge-text">Mon–Fri: 11AM – 1AM<br />Sat–Sun: 11AM – 2AM</div>
            </div>
          </div>
        </section>

        {/* ══════════ BRANCHES — cream bg ══════════ */}
        <nav className="mp-branches">
          <div className="mp-branches-header">
            <span className="mp-branches-label">Select Location</span>
            <span className="mp-branches-line" />
          </div>
          <div className="mp-branches-inner" ref={branchesRef}>
            {branches.map(b => (
              <button
                key={b.id}
                className={'mp-branch-tab' + (selectedBranch === b.id ? ' active' : '')}
                onClick={() => setSelectedBranch(b.id)}
              >
                <span className="mp-branch-check">✓</span>
                <span className="mp-branch-tag">{b.tag}</span>
                <div className="mp-branch-name">{b.name}</div>
                <div className="mp-branch-addr">{b.address}</div>
              </button>
            ))}
          </div>
        </nav>

        {/* ══════════ CATEGORIES ══════════ */}
        <section className="mp-cats-sec">
          <div className="mp-cats-inner">
            <Reveal>
              <span className="mp-sec-label">Browse by</span>
              <h2 className="mp-sec-title">Choose a <em>Category</em></h2>
            </Reveal>
            <div className="mp-cats-scroll" ref={scrollRef}>
              {categoryData.map(cat => (
                <button
                  key={cat.id}
                  className={'mp-cat-pill' + (selectedCategory === cat.id ? ' active' : '')}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span className="mp-cat-emoji">{cat.emoji}</span>
                  <span className="mp-cat-name">{cat.name}</span>
                  <span className="mp-cat-count">{countFor(cat.id)}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ CATEGORY IMAGE — FLOATING FOOD ══════════ */}
        {selectedCategory !== 'All' && (
          <section className="mp-cat-float-sec">
            <div className="mp-cat-float-wrap">
              <img
                src={getCategoryImage(selectedCategory)}
                alt={selectedCategory}
                className="mp-cat-float-img"
              />
            </div>
            <div className="mp-cat-float-name">{selectedCategory}</div>
          </section>
        )}

        {/* ══════════ MENU ITEMS ══════════ */}
        <section className="mp-menu-sec">
          <div className="mp-menu-inner">
            <Reveal>
              <div className="mp-menu-header">
                <div>
                  <div className="mp-menu-header-title">
                    {selectedCategory === 'All' ? 'All Items' : selectedCategory}
                  </div>
                  <div className="mp-menu-header-sub">
                    {loading ? 'Loading...' : `${filtered.length} item${filtered.length !== 1 ? 's' : ''}`} · {branches.find(b => b.id === selectedBranch)?.name}
                  </div>
                </div>
                <div className="mp-filter-row">
                  <button className={'mp-filter-btn' + (!showPopular ? ' active' : '')} onClick={() => setShowPopular(false)}>All</button>
                  <button className={'mp-filter-btn' + (showPopular ? ' active' : '')} onClick={() => setShowPopular(true)}>Popular</button>
                </div>
              </div>
            </Reveal>

            <div className="mp-grid">
              {loading && filtered.length === 0 ? (
                <div className="mp-loading">
                  <div className="mp-loading-spinner" />
                  <div className="mp-loading-text">Loading menu...</div>
                </div>
              ) : filtered.length === 0 ? (
                <div className="mp-empty">
                  <div className="mp-empty-icon">🍽️</div>
                  <div className="mp-empty-text">No items found</div>
                </div>
              ) : (
                (showAllItems ? filtered : filtered.slice(0, visibleItemCount)).map((item, idx) => (
                  <Reveal key={item.id} delay={idx * 35}>
                    <div className="mp-card">
                      <div className="mp-card-body">
                        <div className="mp-card-top">
                          {item.popular && <div className="mp-card-popular-tag">★ Popular</div>}
                        </div>
                        <div className="mp-card-name">{item.name}</div>
                        <p className="mp-card-desc">{item.description}</p>
                        <div className="mp-card-rule" />
                        <div className="mp-card-footer">
                          <div className="mp-card-price">
                            <span>Rs.</span>{item.price.toLocaleString()}
                          </div>
                          <button
                            className={'mp-card-add' + (addedId === item.id ? ' added' : '') + (!isItemAvailableNow(item) || !isRestaurantOpen ? ' disabled' : '')}
                            onClick={() => (isItemAvailableNow(item) && isRestaurantOpen) && handleAdd(item)}
                            disabled={!isItemAvailableNow(item) || !isRestaurantOpen}
                            aria-label={`Add ${item.name} to cart`}
                          >
                            {!isRestaurantOpen ? 'Closed' : (!isItemAvailableNow(item) ? '🔒' : (addedId === item.id ? '✓' : '+'))}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))
              )}
              {loading && filtered.length > 0 && (
                <div className="mp-loading-more">
                  <div className="mp-loading-spinner-small" />
                  <span>Loading more...</span>
                </div>
              )}
              <div ref={loadMoreRef} style={{ height: '20px', margin: '20px 0' }} />
              {filtered.length > visibleItemCount && (
                <div className="mp-show-more-wrap">
                  <button className="mp-show-more-btn" onClick={() => setShowAllItems(!showAllItems)}>
                    {showAllItems ? <>Show Less ↑</> : <>Show {filtered.length - visibleItemCount} More ↓</>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

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
    </>
  );
}