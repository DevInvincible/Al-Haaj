import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { sendWhatsAppMessage } from '../hooks';

const packages = [
  // 100 Guests Packages (min 100 people) - As per images
  { id: 'pkg-01', name: 'Package 01', pricePerPerson: 1050, guests: 100, items: ['Chicken Biryani', 'Chicken Koyla Karahi', 'Chicken Handi Kabab', 'Chicken Bihari Tikka (12pcs)', 'Ice Cream Cattle', 'Gulab Jamun', 'Milky Naan', 'Taftan', 'Green Salad Platter', 'Raita'] },
  { id: 'pkg-02', name: 'Package 02', pricePerPerson: 930, guests: 100, items: ['Beef Biryani Boneless', 'Chicken Koyla Karahi', 'Chicken Qeema Masala', 'Singaporean Rice', 'Wonton', 'Ice Cream Cattle', 'Milky Naan', 'Taftan', 'Green Salad Platter', 'Raita'] },
  { id: 'pkg-03', name: 'Package 03', pricePerPerson: 780, guests: 100, items: ['Welcome Drink','Beef Biryani Boneless', 'Chicken Tikka Karahi', 'Rabri Kheer', 'Wonton', 'Milky Naan', 'Taftan', 'Green Salad Platter', 'Raita'] },
  { id: 'pkg-04', name: 'Package 04', pricePerPerson: 820, guests: 100, items: ['Beef Biryani Boneless', 'Chicken Tikka Karahi / Chicken White Karahi', 'Chicken Chowmein', 'Lub-e-Sheeren / Rabri Kheer', 'Milky Naan', 'Taftan', 'Green Salad Platter / Russian Salad Platter', 'Raita'] },
  { id: 'pkg-05', name: 'Package 05', pricePerPerson: 900, guests: 100, items: ['Chicken Biryani', 'Chicken Tikka Karahi / Live Koyla Karahi', 'Chicken Bihari Tikka / Malai Tikka / Chicken Chaanp', 'Ice Cream Cattle / Cream Cattle / Doodh Dulhari', 'Milky Naan', 'Taftan', 'Green Salad Platter / Russian Salad Platter', 'Raita'] },
  { id: 'pkg-06', name: 'Package 06', pricePerPerson: 900, guests: 100, items: ['Chicken Biryani / Pulao', 'Chicken Tikka Karahi / Shinwari Karahi / Peshawari Karahi Live', 'Chicken Bihari Tikka / Chicken Steam Foil / Malai Tikka', 'Ice Cream Ka Cattle / Gajar(Carrot) Ka Halwa / Rabri Faaloda Kheer', 'Milky Naan', 'Taftan', 'Green Salad Platter / Russian Salad Platter', 'Raita'] },
  { id: 'pkg-07', name: 'Package 07', pricePerPerson: 600, guests: 100, items: ['Chicken Biryani', 'Chicken Tikka Karahi / white Karahi','Rabri Kheer / fruit truffle', 'Milky Naan', 'Taftan', 'Green Salad Platter / Russian Salad Platter', 'Raita'] },
  // 200 Guests Packages (min 200 people) - As per images
  { id: 'pkg-08', name: 'Package 08', pricePerPerson: 1180, guests: 200, items: ['Beef Biryani Boneless', 'Chicken Koyla Karahi / Peshawari Karahi / Balochi Karahi', 'Singaporean Rice', 'Chicken Handi Kabab','Chicken Chaanp', 'Doodh Dulhari / Cream Cattle / Rabri Falooda Kheer', 'Gulab Jamun', 'Milky Naan', 'Taftan', 'Green Salad Platter / Russian Salad Platter', 'Raita'] },
  { id: 'pkg-09', name: 'Package 09', pricePerPerson: 1300, guests: 200, items: ['Welcome Drink','Chicken Biryani', 'Chicken Koyla Karahi / Balochi Karahi / Salateen Karahi', 'Chicken Angaara Kabab / Eclair Cheese Kabab / Grill Cheese Kabab', 'Chicken Kurkury / Dynamite Chicken' , 'Chicken Chaanp', 'Fruit Cattle/Cream Cattle','Dessert Bar(15 Items with Chocolate Fountain)', 'Gulab Jamun', 'Live Tandoor', 'Taftan', 'Green Salad Platter / Russian Salad Platter', 'Raita'] },
  { id: 'pkg-10', name: 'Package 10', pricePerPerson: 1250, guests: 200, items: ['Chicken Corn Soup / Welcome Drink', 'Chicken Biryani' , 'Chicken Koyla Karahi / White Karahi', 'Beef Dum ka Qeema / Beef Badami Qorma Boneless' ,  'Eclair Cheese Kabab / Chicken Lavish Boti', 'Chicken Kurkury / Chicken Lemon Bite', 'Rabri Kheer / Fruit Truffle / Lub-e-Sheeren', 'Dessert Bar(15 Items with Chocolate Fountain)', 'Ice Cream (Almond Roasted or 3 in 1)', 'Milky Naan', 'Taftan', 'Green Salad Bar (9 Bowls)', 'Raita'] },
  { id: 'pkg-11', name: 'Package 11', pricePerPerson: 920, guests: 200, items: ['Chicken Biryani', 'Chicken Tikka Karahi', 'Chicken Kurkury / Chicken Lemon Bite', 'Eclair Cheese Kabab / Handi Kabab / Angaara Kabab', 'Lub-e-Sheeren / Fruit Truffle / Rabri Kheer','Milky Naan', 'Taftan', 'Green Salad Platter / Russian Salad Platter', 'Raita'] },
  { id: 'pkg-12', name: 'Package 12', pricePerPerson: 760, guests: 200, items: ['Beef Biryani Boneless', 'Chicken White Karahi / Tikka Karahi', 'Beef Daleem', 'Wonton / Kachori Tarkari' , 'Rabri Kheer / Lub-e-Sheeren', 'Gulab Jamun / Dahi Baray', 'Milky Naan', 'Taftan', 'Green Salad Platter / Russian Salad Platter', 'Raita'] },
  { id: 'pkg-13', name: 'Package 13', pricePerPerson: 900, guests: 200, items: ['Beef Biryani Boneless', 'Chicken Tikka Karahi / Chicken badami Qorma', 'Chicken Bihari Tikka / Chicken Chaanp', 'Rabri Kheer / Lub-e-Sheeren', 'Gulab Jamun / Dahi Baray', 'Milky Naan', 'Taftan', 'Green Salad Platter / Russian Salad Platter', 'Raita'] },
  { id: 'pkg-14', name: 'Package 14', pricePerPerson: 850, guests: 200, items: ['Chicken Biryani', 'Chicken Koyla Karahi Live / Shinwari Karahi', 'Chicken Chaanp / Chicken Steam / Chicken Roast', 'Gajar Ka Halwa / Fruit Cattle', 'Gulab Jamun / Dahi Baray', 'Milky Naan', 'Taftan', 'Green Salad Platter / Russian Salad Platter ', 'Raita'] },
  { id: 'pkg-15', name: 'Package 15', pricePerPerson: 980, guests: 200, items: ['Beef Biryani', 'Chicken White Qorma / Chicken Badam Qorma', 'Chicken Grill Kabab / Handi Kabab / Eclair Cheese / Kabab', 'Urbian Puff', 'Ice Cream Cattle / Rabri Falooda Kheer', 'Dessert Bar(15 Items with Chocolate Fountain)', 'Milky Naan', 'Taftan', 'Green Salad Platter / Russian Salad Platter', 'Raita'] },
  { id: 'pkg-16', name: 'Package 16', pricePerPerson: 670, guests: 200, items: ['Chicken Biryani', 'Chicken White Karahi / Tikka Karahi', 'Doodh Dulhari / Rabri / Cream Cattle', 'Wonton / Kachoori + Tarkari', 'Gulab Jamun', 'Dahi Baray', 'Milky Naan', 'Taftan', 'Green Salad Platter / Russian Salad Platter', 'Raita'] },
  { id: 'pkg-17', name: 'Package 17', pricePerPerson: 585, guests: 200, items: ['Chicken Biryani', 'Chicken Live Koyla Karahi / Chicken Tikka Karahi', 'Rabri Kheer / Dessert Bar', 'Milky Naan', 'Taftan', 'Green Salad Platter / Russian Salad Platter', 'Raita'] },
  { id: 'pkg-18', name: 'Package 18', pricePerPerson: 650, guests: 200, items: ['Beef Biryani Boneless', 'Chicken Live Koyla Karahi / Chicken Tikka Karahi', 'Lub-e-Sheeren / Fruit Truffle / Dessert Bar', 'Milky Naan', 'Taftan', 'Green Salad Platter / Russian Salad Platter', 'Raita', 'Paan Stall', 'Cheeni Aloo Bukhara + Mirch Salan + Baghary Baingan' ] },
  { id: 'pkg-19', name: 'Package 19', pricePerPerson: 700, guests: 200, items: ['Chicken Kofta Pulao / Chicken Biryani', 'Beef Badami Qorma Boneless','Cheery Krunch', 'Milky Naan', 'Taftan', 'Green Salad Platter / Russian Salad Platter', 'Raita', 'Paan Stall / Dahi Baray' , 'Cheeni Aloo Bukhara + Mirch Salan + Baghary Baingan'] },
];

// Restaurant/Event Packages (Flat Rate - No Guest Count)
const restaurantPackages = [
  { id: 'rest-01', name: 'Package #1', price: 500, items: ['Gola Kabab', 'Paratha', 'Kachori', 'Aalo Chana Tarkari', 'Piyaz', 'Green Chatni', 'Gulab Jaman'] },
  { id: 'rest-02', name: 'Package #2', price: 550, items: ['Chandan Kabab', 'Poori Paratha', 'Kachori', 'Aalo Chana Tarkari', 'Green Chatni', 'Piyaz', 'Gulab Jaman'] },
  { id: 'rest-03', name: 'Package #3', price: 650, items: ['Gola Kabab', 'Chicken Tikka', 'Poori Paratha', 'Kachori', 'Aalo Chana Tarkari', 'Piyaz', 'Green Chatni', 'Gulab Jaman'] },
  { id: 'rest-04', name: 'Package #4', price: 680, popular: true, items: ['Chicken Bihari / Malai Tikka', 'Poori Paratha', 'Kachori', 'Aalo Chana Tarkari', 'Green Chatni', 'Piyaz', 'Gulab Jaman', 'Suji Ka Halwa'] },
];

const eventTypes = [
  { id: 'wedding', name: 'Wedding', icon: '💒' },
  { id: 'corporate', name: 'Corporate', icon: '💼' },
  { id: 'birthday', name: 'Birthday', icon: '🎂' },
  { id: 'mehndi', name: 'Mehndi', icon: '🌸' },
  { id: 'other', name: 'Other', icon: '🎉' },
];

const branches = [
  { id: 'nagan', name: 'Nagan Head Office', address: 'Nagan Chowrangi, Karachi', phone: '0321-9292767', tag: 'HEAD OFFICE' },
  { id: 'gulshan', name: 'Gulshan Campus', address: 'Gulshan-e-Iqbal, Karachi', phone: '0300-9292767', tag: 'CENTRAL' },
  { id: 'jauhar', name: 'Jauhar Campus', address: 'Haji Ali Jan, Gulistan-e-Jauhar, Karachi', phone: '0323-9292767', tag: 'EAST' },
];

const contactInfo = { cell: '0320-9292888', headOffice: '0321-9292767', gulshanBranch: '0300-9292767', jauharBranch: '0323-9292767' };

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) el.classList.add('vis'); }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}
function Reveal({ children, delay = 0 }) {
  const ref = useReveal();
  return <div ref={ref} className="rv" style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

/* ─────────────── HERO MARQUEE DATA ─────────────── */
const marqueeItems = [
  { label: 'Chicken Biryani', tag: 'Signature' },
  { label: 'Beef Karahi', tag: 'Popular' },
  { label: 'Malai Boti', tag: 'Specialty' },
  { label: 'Gulab Jamun', tag: 'Dessert' },
  { label: 'Steam Roast', tag: 'Favorite' },
  { label: 'Biryani Pulao', tag: 'Classic' },
  { label: 'Chocolate Fountain', tag: 'Premium' },
  { label: 'Double Ka Meetha', tag: 'Sweet' },
];

const heroStats = [
  { num: '50+', label: 'Years Legacy', icon: '🏆' },
  { num: '19', label: 'Packages', icon: '📦' },
  { num: '3', label: 'Locations', icon: '📍' },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.cp-root {
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
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes cardEnter {
  from { opacity: 0; transform: translateY(30px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes shimmerCream {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}

/* ══════════════ HERO ══════════════ */
.cp-hero {
  position: relative;
  min-height: 500px;
  display: flex;
  align-items: stretch;
  overflow: hidden;
  background: #080808;
}

/* Left dark panel */
.cp-hero-panel-left {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 130px 48px 64px 80px;
  z-index: 2;
}

/* Right cream panel */
.cp-hero-panel-right {
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
.cp-hero-panel-right::before {
  content: '';
  position: absolute;
  top: -80px; right: -80px;
  width: 300px; height: 300px;
  border-radius: 50%;
  background: rgba(200,16,46,0.06);
  z-index: 0;
}
.cp-hero-panel-right::after {
  content: '';
  position: absolute;
  bottom: -60px; left: -60px;
  width: 250px; height: 250px;
  border-radius: 50%;
  background: rgba(200,16,46,0.04);
  z-index: 0;
}

/* Diagonal separator */
.cp-hero-divider-line {
  position: absolute;
  top: 0; bottom: 0;
  width: 64px;
  background: #F5E6C8;
  clip-path: polygon(60% 0%, 100% 0%, 100% 100%, 0% 100%);
  z-index: 3;
  right: 380px;
}

.cp-hero-bg {
  position: absolute; inset: 0; z-index: 0;
  background:
    radial-gradient(ellipse 60% 80% at 20% 60%, rgba(200,16,46,0.1) 0%, transparent 65%),
    radial-gradient(ellipse 40% 50% at 60% 20%, rgba(0,33,100,0.06) 0%, transparent 50%);
}
.cp-hero-grid {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(245,230,200,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(245,230,200,0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 70% 90% at 30% 60%, black 20%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 70% 90% at 30% 60%, black 20%, transparent 80%);
}
.cp-hero-accent {
  position: absolute; top: 0; left: 0; right: 0; height: 2px; z-index: 5;
  background: linear-gradient(90deg, transparent 0%, #C8102E 25%, #F5E6C8 50%, #C8102E 75%, transparent 100%);
}

.cp-hero-eyebrow {
  display: inline-flex; align-items: center; gap: 10px;
  background: rgba(200,16,46,0.1);
  border: 1px solid rgba(200,16,46,0.2);
  padding: 8px 18px; border-radius: 50px;
  font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase;
  color: #e87a8a; font-weight: 600; margin-bottom: 28px;
  animation: fadeUp 0.7s 0.1s both;
  width: fit-content;
}
.cp-hero-eyebrow-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #C8102E; animation: pulse-ring 2s infinite;
}
.cp-hero-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(38px, 5.5vw, 68px);
  font-weight: 700; line-height: 1.1;
  letter-spacing: -0.025em; color: #fff;
  animation: fadeUp 0.7s 0.2s both;
  margin-bottom: 20px;
}
.cp-hero-title em {
  font-style: italic; font-weight: 400;
  color: #F5E6C8; display: block;
}
.cp-hero-desc {
  font-size: 15px; color: rgba(255,255,255,0.5);
  line-height: 1.8; max-width: 460px;
  animation: fadeUp 0.7s 0.3s both;
}

/* RIGHT PANEL — cream content */
.cp-hero-cream-label {
  position: relative; z-index: 1;
  font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase;
  color: #C8102E; font-weight: 700; margin-bottom: 20px;
  display: flex; align-items: center; gap: 8px;
  animation: fadeUp 0.7s 0.2s both;
}
.cp-hero-cream-label::before {
  content: ''; width: 20px; height: 1px; background: #C8102E;
}
.cp-hero-stats-list {
  position: relative; z-index: 1;
  display: flex; flex-direction: column; gap: 20px;
  animation: fadeUp 0.7s 0.3s both;
}
.cp-hero-stat-item {
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(42,26,0,0.1);
}
.cp-hero-stat-item:last-child { border-bottom: none; padding-bottom: 0; }
.cp-hero-stat-num {
  font-family: 'Playfair Display', serif;
  font-size: 44px; font-weight: 700;
  color: #C8102E; line-height: 1;
}
.cp-hero-stat-lbl {
  font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
  color: #8C6A3A; font-weight: 600; margin-top: 4px;
}
.cp-hero-cream-badge {
  position: relative; z-index: 1;
  margin-top: 28px;
  background: rgba(200,16,46,0.1);
  border: 1px solid rgba(200,16,46,0.2);
  border-radius: 10px; padding: 14px 16px;
  animation: fadeUp 0.7s 0.4s both;
}
.cp-hero-cream-badge-title {
  font-size: 11px; font-weight: 700; color: #C8102E;
  letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px;
}
.cp-hero-cream-badge-text {
  font-size: 13px; color: #5a3a1a; line-height: 1.5;
}

/* SCROLLING TICKER */
.cp-ticker {
  position: relative; z-index: 3;
  background: #F5E6C8;
  overflow: hidden; padding: 12px 0;
}
.cp-ticker::before, .cp-ticker::after {
  content: ''; position: absolute; top: 0; bottom: 0; width: 80px; z-index: 2;
}
.cp-ticker::before { left: 0; background: linear-gradient(to right, #F5E6C8, transparent); }
.cp-ticker::after  { right: 0; background: linear-gradient(to left, #F5E6C8, transparent); }

.cp-ticker-track {
  display: flex; gap: 0;
  animation: marquee 30s linear infinite;
  width: max-content;
}
.cp-ticker-item {
  display: flex; align-items: center; gap: 10px;
  padding: 0 32px; white-space: nowrap;
  border-right: 1px solid rgba(200,16,46,0.15);
}
.cp-ticker-name { font-size: 13px; color: #2A1A00; font-weight: 600; }
.cp-ticker-tag {
  font-size: 11px; color: #C8102E; font-weight: 700;
  background: rgba(200,16,46,0.1); padding: 2px 8px;
  border-radius: 10px; letter-spacing: 0.05em;
}

/* ══════════════ FOOD GALLERY ══════════════ */
.cp-food-gallery-sec { background: #0a0a0a; padding: 80px 0; }
.cp-food-gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 40px; }
.cp-food-item {
  position: relative; border-radius: 16px; overflow: hidden;
  border: 1px solid rgba(255,255,255,0.06); aspect-ratio: 4/3;
}
.cp-food-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.cp-food-item:hover img { transform: scale(1.06); }
.cp-food-label {
  position: absolute; bottom: 0; left: 0; right: 0; padding: 16px;
  background: linear-gradient(to top, rgba(0,0,0,0.85), transparent);
  font-size: 14px; font-weight: 600; color: #fff;
}

/* ══════════════ PACKAGES ══════════════ */
.cp-pkgs-sec { background: #0a0a0a; padding: 80px 0; }
.cp-inner { max-width: 1280px; margin: 0 auto; padding: 0 48px; }

.cp-sec-label {
  font-size: 11px; letter-spacing: 0.4em; text-transform: uppercase;
  color: rgba(245,230,200,0.5); font-weight: 600; display: block; margin-bottom: 10px;
}
.cp-sec-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(28px, 4vw, 38px); font-weight: 700;
  color: #fff; line-height: 1.2; margin-bottom: 36px;
}
.cp-sec-title em { font-style: italic; font-weight: 400; color: #F5E6C8; }

.cp-pkgs-filter {
  display: flex; gap: 10px; margin-bottom: 32px; flex-wrap: wrap;
}
.cp-filter-btn {
  padding: 8px 18px;
  background: rgba(245,230,200,0.03);
  border: 1px solid rgba(245,230,200,0.1);
  border-radius: 8px; color: rgba(255,255,255,0.5);
  font-size: 13px; font-weight: 500; cursor: pointer;
  transition: all 0.25s ease;
}
.cp-filter-btn:hover {
  border-color: rgba(245,230,200,0.3);
  background: rgba(245,230,200,0.06);
  color: #F5E6C8;
}
.cp-filter-btn.active {
  background: #F5E6C8;
  border-color: #F5E6C8;
  color: #2A1A00;
}

/* Category Tabs */
.cp-category-tabs {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  justify-content: center;
  flex-wrap: wrap;
}
.cp-category-btn {
  padding: 16px 28px;
  background: rgba(245,230,200,0.03);
  border: 1px solid rgba(245,230,200,0.1);
  border-radius: 12px;
  color: rgba(255,255,255,0.6);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.cp-category-btn:hover {
  border-color: rgba(245,230,200,0.3);
  background: rgba(245,230,200,0.06);
  color: #F5E6C8;
}
.cp-category-btn.active {
  background: #F5E6C8;
  border-color: #F5E6C8;
  color: #2A1A00;
}
.cp-category-sub {
  font-size: 11px;
  font-weight: 500;
  opacity: 0.7;
}

.cp-pkgs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }

.cp-pkg-card {
  background: #111;
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 18px; overflow: hidden;
  transition: all 0.4s cubic-bezier(0.22,1,0.36,1);
  cursor: pointer;
  animation: cardEnter 0.5s cubic-bezier(0.22,1,0.36,1) backwards;
}
.cp-pkg-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, #F5E6C8, transparent);
  opacity: 0; transition: opacity 0.3s ease;
}
.cp-pkg-card:hover::before { opacity: 1; }
.cp-pkg-card:hover {
  transform: translateY(-7px);
  border-color: rgba(245,230,200,0.15);
  box-shadow: 0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,230,200,0.08);
}
.cp-pkg-card.selected {
  border-color: #F5E6C8;
  box-shadow: 0 0 0 1px #F5E6C8, 0 20px 48px rgba(0,0,0,0.5);
}

.cp-pkg-header {
  padding: 24px 24px 20px;
  background: linear-gradient(135deg, rgba(245,230,200,0.04) 0%, rgba(0,0,0,0) 100%);
  border-bottom: 1px solid rgba(245,230,200,0.05);
  display: flex; align-items: flex-start; gap: 14px;
}
.cp-pkg-number {
  min-width: 44px; height: 44px;
  background: linear-gradient(135deg, #C8102E, #900e22);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; font-weight: 700; color: #fff; flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(200,16,46,0.3);
}
.cp-pkg-number-200 {
  background: linear-gradient(135deg, #d4af37, #a88520);
  box-shadow: 0 4px 12px rgba(212,175,55,0.3);
}
.cp-pkg-header-info { flex: 1; }
.cp-pkg-guests-badge {
  display: inline-block;
  background: rgba(245,230,200,0.1); border: 1px solid rgba(245,230,200,0.2);
  padding: 3px 10px; border-radius: 20px;
  font-size: 11px; font-weight: 600; color: #F5E6C8;
  margin-bottom: 6px; letter-spacing: 0.05em;
}
.cp-pkg-card-200 .cp-pkg-guests-badge {
  background: rgba(212,175,55,0.1); border-color: rgba(212,175,55,0.3); color: #d4af37;
}

/* Restaurant Package Styles */
.cp-restaurant-card {
  background: linear-gradient(135deg, #1a1510 0%, #0f0c08 100%);
  border-color: rgba(200,16,46,0.2);
}
.cp-restaurant-card:hover {
  border-color: rgba(200,16,46,0.4);
  box-shadow: 0 20px 50px rgba(200,16,46,0.15), 0 0 0 1px rgba(200,16,46,0.1);
}
.cp-restaurant-number {
  background: #C8102E !important;
  color: #fff !important;
  font-size: 11px !important;
  width: auto !important;
  min-width: 70px !important;
  padding: 8px 12px !important;
  border-radius: 20px !important;
  white-space: nowrap !important;
}
.cp-pkg-guests-badge.flat {
  background: rgba(200,16,46,0.15);
  border-color: rgba(200,16,46,0.3);
  color: #C8102E;
}
.cp-pkg-unit.flat {
  color: rgba(245,230,200,0.5);
  font-size: 12px;
}
.cp-pkg-total.flat {
  color: rgba(245,230,200,0.4);
  font-size: 12px;
}

.cp-pkg-name {
  font-family: 'Playfair Display', serif;
  font-size: 18px; font-weight: 600; color: #fff;
}

.cp-pkg-body { padding: 22px 24px 24px; position: relative; }
.cp-pkg-price-row {
  display: flex; align-items: baseline; gap: 6px; margin-bottom: 4px;
}
.cp-pkg-price {
  font-family: 'Playfair Display', serif;
  font-size: 26px; font-weight: 700; color: #F5E6C8;
}
.cp-pkg-unit { font-size: 12px; color: rgba(245,230,200,0.4); }
.cp-pkg-total {
  font-size: 13px; color: rgba(255,255,255,0.35); margin-bottom: 18px; font-weight: 500;
}
.cp-pkg-items { list-style: none; }
.cp-pkg-items li {
  padding: 7px 0; border-bottom: 1px solid rgba(245,230,200,0.04);
  font-size: 13px; color: rgba(255,255,255,0.6);
  display: flex; align-items: center; gap: 10px;
}
.cp-pkg-items li:last-child { border-bottom: none; }
.cp-pkg-check { color: #F5E6C8; font-size: 12px; font-weight: 700; }
.cp-more-items { color: rgba(245,230,200,0.6); font-weight: 600; font-size: 12px; }

.cp-pkg-select-btn {
  width: 100%; padding: 12px;
  background: rgba(245,230,200,0.06);
  border: 1px solid rgba(245,230,200,0.12);
  border-radius: 10px; color: rgba(245,230,200,0.7);
  font-size: 13px; font-weight: 500; cursor: pointer;
  transition: all 0.3s ease; margin-top: 16px;
  letter-spacing: 0.04em;
}
.cp-pkg-select-btn:hover {
  background: #F5E6C8;
  border-color: #F5E6C8;
  color: #2A1A00;
}
.cp-pkg-card.selected .cp-pkg-select-btn {
  background: #F5E6C8;
  border-color: #F5E6C8; color: #2A1A00;
}

.cp-show-more-wrap { display: flex; justify-content: center; margin-top: 40px; }
.cp-show-more-btn {
  display: flex; align-items: center; gap: 8px;
  padding: 13px 28px;
  background: rgba(245,230,200,0.04);
  border: 1px solid rgba(245,230,200,0.12);
  border-radius: 50px; color: rgba(245,230,200,0.6);
  font-size: 13px; cursor: pointer; transition: all 0.3s ease;
}
.cp-show-more-btn:hover {
  background: rgba(245,230,200,0.1);
  border-color: rgba(245,230,200,0.25);
  color: #F5E6C8;
}

/* ══════════════ BRANCHES — horizontal scroll ══════════════ */
.cp-branch-sec { background: #F5E6C8; padding: 60px 0; }
.cp-branches-header {
  display: flex; align-items: center; gap: 16px; margin-bottom: 28px; padding: 0 24px;
}
.cp-branches-label {
  font-size: 12px; letter-spacing: 0.25em; text-transform: uppercase;
  color: #8C6A3A; font-weight: 700; white-space: nowrap;
}
.cp-branches-line {
  flex: 1; height: 1px;
  background: linear-gradient(90deg, rgba(140,106,58,0.3) 0%, transparent 100%);
}
.cp-branches-inner {
  display: flex; gap: 16px;
  overflow-x: auto; scroll-snap-type: x mandatory;
  padding: 0 24px 24px; scrollbar-width: none;
  cursor: grab; user-select: none;
}
.cp-branches-inner.dragging { cursor: grabbing; }
.cp-branches-inner.dragging .cp-branch-tab { pointer-events: none; }
.cp-branches-inner::-webkit-scrollbar { display: none; }
.cp-branch-tab {
  flex: 0 0 280px; min-width: 280px;
  background: #FFFBF5;
  border: 2px solid rgba(200,16,46,0.08);
  border-radius: 16px; padding: 24px;
  cursor: pointer; transition: all 0.3s ease;
  position: relative; scroll-snap-align: start;
  text-align: left;
}
.cp-branch-tab:hover {
  background: #FFF8F0;
  border-color: rgba(200,16,46,0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(200,16,46,0.1);
}
.cp-branch-tab.active {
  background: #FFFAF0;
  border-color: #C8102E;
  box-shadow: 0 6px 20px rgba(200,16,46,0.15);
}
.cp-branch-check {
  position: absolute;
  top: 12px; right: 12px;
  width: 24px; height: 24px;
  background: #C8102E;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; color: #fff;
  opacity: 0; transform: scale(0); transition: all 0.3s ease;
}
.cp-branch-tab.active .cp-branch-check { opacity: 1; transform: scale(1); }
.cp-branch-tag {
  font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
  color: #C8102E; font-weight: 700; margin-bottom: 8px; display: block;
}
.cp-branch-name {
  font-family: 'Playfair Display', serif;
  font-size: 22px; font-weight: 700;
  color: #2A1A00; margin-bottom: 6px; line-height: 1.2;
}
.cp-branch-addr {
  font-size: 14px; color: #6A5A4A; line-height: 1.5;
}

/* ══════════════ ENHANCED FORM ══════════════ */
.cp-form-sec { background: #080808; padding: 80px 0; }

.cp-form-layout {
  display: grid; grid-template-columns: 1fr 400px; gap: 32px;
  align-items: flex-start;
}

.cp-form-container {
  background: #0f0f0f; border: 1px solid rgba(245,230,200,0.08);
  border-radius: 24px; padding: 40px; overflow: hidden;
}
.cp-form-container-title {
  font-family: 'Playfair Display', serif;
  font-size: 22px; font-weight: 600; color: #fff;
  margin-bottom: 6px;
}
.cp-form-container-sub {
  font-size: 14px; color: rgba(255,255,255,0.35); margin-bottom: 32px;
}

.cp-form-divider {
  height: 1px; background: rgba(245,230,200,0.06); margin: 24px 0;
}

.cp-form-group { margin-bottom: 20px; position: relative; }
.cp-form-label {
  display: block; font-size: 11px; letter-spacing: 0.14em;
  text-transform: uppercase; color: rgba(245,230,200,0.5);
  margin-bottom: 8px; font-weight: 600;
}
.cp-form-label span { color: #F5E6C8; margin-left: 3px; }

.cp-form-input, .cp-form-textarea {
  width: 100%; padding: 13px 16px;
  background: rgba(245,230,200,0.03);
  border: 1px solid rgba(245,230,200,0.1);
  color: #fff; font-size: 14px; border-radius: 10px;
  transition: all 0.25s ease; font-family: 'Inter', sans-serif;
}
.cp-form-input:focus, .cp-form-textarea:focus {
  outline: none;
  border-color: rgba(245,230,200,0.3);
  background: rgba(245,230,200,0.06);
  box-shadow: 0 0 0 3px rgba(245,230,200,0.04);
}
.cp-form-input::placeholder, .cp-form-textarea::placeholder {
  color: rgba(255,255,255,0.2);
}
.cp-form-textarea { resize: vertical; min-height: 100px; line-height: 1.6; }

.cp-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

/* Event Type */
.cp-event-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
.cp-event-btn {
  padding: 14px 8px;
  background: rgba(245,230,200,0.03);
  border: 1px solid rgba(245,230,200,0.1);
  border-radius: 10px;
  color: #F5E6C8;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.cp-event-btn span { font-size: 18px; }
.cp-event-btn:hover { background: rgba(245,230,200,0.06); border-color: rgba(245,230,200,0.2); }
.cp-event-btn.selected {
  background: rgba(200,16,46,0.15);
  border-color: #C8102E;
  color: #fff;
}

/* Branch Selection in Form */
.cp-branch-select-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.cp-branch-select-btn {
  padding: 16px 12px;
  background: rgba(245,230,200,0.03);
  border: 1px solid rgba(245,230,200,0.1);
  border-radius: 12px;
  color: #F5E6C8;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  position: relative;
}
.cp-branch-select-check {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  background: #C8102E;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #fff;
}
.cp-branch-select-name { font-size: 13px; font-weight: 600; }
.cp-branch-select-tag { font-size: 10px; color: rgba(245,230,200,0.5); text-transform: uppercase; letter-spacing: 0.1em; }
.cp-branch-select-btn:hover { background: rgba(245,230,200,0.06); border-color: rgba(245,230,200,0.2); }
.cp-branch-select-btn.selected {
  background: rgba(200,16,46,0.15);
  border-color: #C8102E;
  color: #fff;
}
.cp-branch-select-btn.selected .cp-branch-select-tag { color: rgba(255,255,255,0.7); }
.cp-event-btn.selected {
  background: #F5E6C8; border-color: #F5E6C8; color: #2A1A00;
}

/* Selected package field */
.cp-selected-pkg-field {
  padding: 13px 16px;
  background: rgba(245,230,200,0.06);
  border: 1px solid rgba(245,230,200,0.15);
  border-radius: 10px; font-size: 14px;
  color: rgba(255,255,255,0.7); display: flex;
  align-items: center; justify-content: space-between;
}
.cp-selected-pkg-field.empty {
  background: rgba(255,255,255,0.02);
  border-color: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.25);
}
.cp-selected-pkg-clear {
  background: none; border: none; color: rgba(245,230,200,0.6);
  cursor: pointer; font-size: 14px; padding: 0 4px; line-height: 1;
}

/* Submit button */
.cp-submit-btn {
  width: 100%; padding: 16px;
  background: linear-gradient(135deg, #F5E6C8 0%, #E8D5A3 100%);
  border: none; color: #2A1A00; font-size: 13px;
  letter-spacing: 0.1em; text-transform: uppercase;
  font-weight: 600; cursor: pointer; border-radius: 12px;
  transition: all 0.3s ease; font-family: 'Inter', sans-serif;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  position: relative; overflow: hidden;
}
.cp-submit-btn:hover {
  background: linear-gradient(135deg, #fff, #F5E6C8);
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(245,230,200,0.2);
}

/* ── ORDER SUMMARY CARD ── */
.cp-summary-card {
  background: #0f0f0f; border: 1px solid rgba(245,230,200,0.1);
  border-radius: 24px; padding: 32px;
  position: sticky; top: 100px;
}
.cp-summary-title {
  font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase;
  color: rgba(245,230,200,0.4); font-weight: 600; margin-bottom: 20px;
}
.cp-summary-empty {
  text-align: center; padding: 30px 0;
}
.cp-summary-empty-icon { font-size: 40px; margin-bottom: 12px; opacity: 0.4; }
.cp-summary-empty-text { font-size: 13px; color: rgba(255,255,255,0.25); line-height: 1.6; }

.cp-summary-pkg-name {
  font-family: 'Playfair Display', serif;
  font-size: 20px; color: #fff; font-weight: 600; margin-bottom: 4px;
}
.cp-summary-pkg-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(245,230,200,0.1); border: 1px solid rgba(245,230,200,0.2);
  padding: 4px 10px; border-radius: 20px;
  font-size: 12px; color: #F5E6C8; font-weight: 600; margin-bottom: 20px;
}
.cp-summary-divider { height: 1px; background: rgba(245,230,200,0.06); margin: 16px 0; }
.cp-summary-row {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 13px; padding: 6px 0;
}
.cp-summary-row-label { color: rgba(255,255,255,0.35); }
.cp-summary-row-val { color: rgba(255,255,255,0.75); font-weight: 500; }
.cp-summary-total-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px; margin-top: 8px;
  background: rgba(245,230,200,0.08); border: 1px solid rgba(245,230,200,0.15);
  border-radius: 10px;
}
.cp-summary-total-label { font-size: 13px; color: rgba(245,230,200,0.6); font-weight: 500; }
.cp-summary-total-val {
  font-family: 'Playfair Display', serif;
  font-size: 24px; color: #F5E6C8; font-weight: 700;
}
.cp-summary-items-preview { margin-top: 16px; }
.cp-summary-items-title {
  font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
  color: rgba(245,230,200,0.3); font-weight: 600; margin-bottom: 10px;
}
.cp-summary-item {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 0; border-bottom: 1px solid rgba(245,230,200,0.04);
  font-size: 12px; color: rgba(255,255,255,0.5);
}
.cp-summary-item:last-child { border-bottom: none; }
.cp-summary-item-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(245,230,200,0.5); flex-shrink: 0; }

.cp-summary-branch {
  margin-top: 20px; padding: 14px;
  background: rgba(255,255,255,0.02); border-radius: 10px;
  border: 1px solid rgba(245,230,200,0.08);
}
.cp-summary-branch-label {
  font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;
  color: rgba(245,230,200,0.35); font-weight: 600; margin-bottom: 6px; display: block;
}
.cp-summary-branch-name { font-size: 13px; color: rgba(255,255,255,0.7); font-weight: 500; }

/* ══════════════ CONTACT ══════════════ */
.cp-contact-sec {
  background: #080808; padding: 60px 0 100px; text-align: center;
}
.cp-contact-inner { max-width: 500px; margin: 0 auto; }
.cp-contact-title {
  font-family: 'Playfair Display', serif;
  font-size: 28px; color: #fff; margin-bottom: 8px;
}
.cp-contact-sub { font-size: 15px; color: rgba(255,255,255,0.35); margin-bottom: 28px; line-height: 1.7; }
.cp-contact-phones {
  display: flex; flex-direction: column; gap: 10px; align-items: center;
}
.cp-contact-phone-item {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 24px;
  background: rgba(245,230,200,0.04); border: 1px solid rgba(245,230,200,0.1);
  border-radius: 50px;
}
.cp-contact-phone-label { font-size: 11px; color: rgba(245,230,200,0.4); letter-spacing: 0.1em; text-transform: uppercase; }
.cp-contact-phone-num { font-family: 'Playfair Display', serif; font-size: 18px; color: #F5E6C8; font-weight: 600; }

/* Mobile stats row (shown when right panel hidden) */
.cp-hero-mobile-stats {
  display: none;
  margin-top: 24px;
  animation: fadeUp 0.7s 0.4s both;
}
.cp-hero-mobile-stat {
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; color: rgba(255,255,255,0.6);
}
.cp-hero-mobile-stat span { color: #F5E6C8; font-weight: 600; }

/* ══════════════ RESPONSIVE ══════════════ */
@media (max-width: 1200px) {
  .cp-hero-panel-right { width: 300px; }
  .cp-hero-divider-line { right: 300px; }
}
@media (max-width: 1100px) {
  .cp-form-layout { grid-template-columns: 1fr; }
  .cp-summary-card { position: static; order: -1; }
}
@media (max-width: 1024px) {
  .cp-hero-panel-right { display: none; }
  .cp-hero-divider-line { display: none; }
  .cp-hero-panel-left { padding: 110px 40px 64px 60px; }
  .cp-hero-mobile-stats { display: flex; flex-wrap: wrap; gap: 16px 24px; }
  .cp-pkgs-grid { grid-template-columns: repeat(2, 1fr); }
  .cp-branch-grid { grid-template-columns: repeat(2, 1fr); }
  .cp-food-gallery { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .cp-inner { padding: 0 20px; }
  .cp-hero-panel-left { padding: 100px 24px 48px 32px; }
  .cp-pkgs-grid { grid-template-columns: 1fr; }
  .cp-branch-grid, .cp-food-gallery { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .cp-form-container { padding: 24px; }
  .cp-event-grid { grid-template-columns: repeat(2, 1fr); }
  .cp-branch-select-grid { grid-template-columns: 1fr; }
  .cp-form-row { grid-template-columns: 1fr; }
  .cp-hero-title { font-size: 36px; }
  .cp-hero-desc { font-size: 14px; max-width: 100%; }
}
`;

export default function CateringPageNew() {
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('nagan');
  const [guests, setGuests] = useState('');
  const [date, setDate] = useState('');
  const [eventType, setEventType] = useState('');
  const [requests, setRequests] = useState('');
  const [showAllPackages, setShowAllPackages] = useState(false);
  const [pkgFilter, setPkgFilter] = useState('all');
  const [pkgCategory, setPkgCategory] = useState('catering'); // 'catering' | 'restaurant'
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const branchesRef = useRef(null);

  // Get initial visible count based on screen size
  const getInitialCount = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      return 3;
    }
    return 6;
  };
  const [initialCount, setInitialCount] = useState(getInitialCount());

  const formRef = useRef(null);
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Branch drag handlers
  const handleBranchMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - (branchesRef.current?.offsetLeft || 0));
    setScrollLeft(branchesRef.current?.scrollLeft || 0);
  };
  const handleBranchMouseUp = () => setIsDragging(false);
  const handleBranchMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (branchesRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    if (branchesRef.current) branchesRef.current.scrollLeft = scrollLeft - walk;
  };

  // Update initial count on window resize
  useEffect(() => {
    const handleResize = () => {
      setInitialCount(getInitialCount());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get selected package from correct array
  const selectedPkg = pkgCategory === 'catering' 
    ? packages.find(p => p.id === selectedPackage)
    : restaurantPackages.find(p => p.id === selectedPackage);
  const selectedBranchData = branches.find(b => b.id === selectedBranch);
  const totalCost = selectedPkg && pkgCategory === 'catering'
    ? (selectedPkg.pricePerPerson * (parseInt(guests) || selectedPkg.guests)).toLocaleString()
    : selectedPkg?.price?.toLocaleString();

  const filteredPackages = pkgCategory === 'catering' 
    ? packages.filter(p => {
        if (pkgFilter === '100') return p.guests === 100;
        if (pkgFilter === '200') return p.guests === 200;
        return true;
      })
    : restaurantPackages;
  const displayPackages = showAllPackages ? filteredPackages : filteredPackages.slice(0, initialCount);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPackage || !guests || !date || !eventType) {
      alert('Please fill in all required fields');
      return;
    }
    const pkg = packages.find(p => p.id === selectedPackage);
    const branch = branches.find(b => b.id === selectedBranch);
    const message =
      `🎉 CATERING INQUIRY - Al Haaj Akhtar\n\n` +
      `📦 Package: ${pkg?.name}\n` +
      `🏢 Branch: ${branch?.name}\n` +
      `👥 Guests: ${guests}\n` +
      `📅 Date: ${date}\n` +
      `🎭 Event: ${eventTypes.find(e => e.id === eventType)?.name}\n\n` +
      `${requests ? `📝 Special Requests: ${requests}\n\n` : ''}` +
      `⏰ Inquiry Time: ${new Date().toLocaleString()}\n\nPlease confirm availability and pricing. Thank you!`;
    sendWhatsAppMessage('catering', message);
  };

  const allMarqueeItems = [...marqueeItems, ...marqueeItems];

  return (
    <>
      <Navbar />
      <div className="cp-root">
        <style>{CSS}</style>

        {/* ══════════ HERO ══════════ */}
        <section className="cp-hero">
          <div className="cp-hero-bg" />
          <div className="cp-hero-grid" />
          <div className="cp-hero-accent" />
          <div className="cp-hero-divider-line" />

          {/* Left panel — dark */}
          <div className="cp-hero-panel-left">
            <div className="cp-hero-eyebrow">
              <span className="cp-hero-eyebrow-dot" />
              Premium Catering Service
            </div>
            <h1 className="cp-hero-title">
              Catering <em>Services</em>
            </h1>
            <p className="cp-hero-desc">
              From intimate gatherings to grand celebrations — bring the authentic taste of Al Haaj Akhtar to your event across all 3 Karachi locations.
            </p>
            {/* Mobile stats - shown when right panel hidden */}
            <div className="cp-hero-mobile-stats">
              {heroStats.slice(0, 3).map((s, i) => (
                <div key={i} className="cp-hero-mobile-stat">
                  <span>{s.icon}</span>
                  <span>{s.num}</span>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel — cream */}
          <div className="cp-hero-panel-right">
            <div className="cp-hero-cream-label">Why Choose Us</div>
            <div className="cp-hero-stats-list">
              {heroStats.map((s, i) => (
                <div key={i} className="cp-hero-stat-item" style={{ animationDelay: `${0.25 + i * 0.08}s` }}>
                  <div className="cp-hero-stat-num">{s.num}</div>
                  <div className="cp-hero-stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="cp-hero-cream-badge">
              <div className="cp-hero-cream-badge-title">📍 3 Locations</div>
              <div className="cp-hero-cream-badge-text">Jauhar, Malir & Orangi - we cater across all of Karachi</div>
            </div>
          </div>
        </section>

        {/* ══════════ SCROLLING TICKER ══════════ */}
        <div className="cp-ticker">
          <div className="cp-ticker-track">
            {[...allMarqueeItems, ...allMarqueeItems].map((item, i) => (
              <div key={i} className="cp-ticker-item">
                <span className="cp-ticker-name">{item.label}</span>
                <span className="cp-ticker-tag">{item.tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════ FOOD GALLERY ══════════ */}
        <section className="cp-food-gallery-sec">
          <div className="cp-inner">
            <Reveal>
              <span className="cp-sec-label">Our Specialties</span>
              <h2 className="cp-sec-title">Signature <em>Daigs & Platters</em></h2>
            </Reveal>
            <div className="cp-food-gallery">
              {[
                { src: '/catering/pakwan.jpg', label: 'Biryani Daig' },
                { src: '/catering/Karahi.jpg', label: 'Qorma Daig' },
                { src: '/catering/dessert.jpg', label: 'Dessert Platter' },
              ].map((item) => (
                <div key={item.label} className="cp-food-item">
                  <img src={item.src} alt={item.label} loading="lazy" />
                  <span className="cp-food-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ PACKAGES ══════════ */}
        <section className="cp-pkgs-sec">
          <div className="cp-inner">
            <Reveal>
              <span className="cp-sec-label">Choose Your Plan</span>
              <h2 className="cp-sec-title">{pkgCategory === 'catering' ? 'Catering' : 'Restaurant / Event'} <em>Packages</em></h2>
            </Reveal>

            {/* Category Filter */}
            <div className="cp-category-tabs">
              <button
                className={`cp-category-btn ${pkgCategory === 'catering' ? 'active' : ''}`}
                onClick={() => { setPkgCategory('catering'); setSelectedPackage(''); setPkgFilter('all'); setShowAllPackages(false); }}
              >
                🎉 Catering Packages
                <span className="cp-category-sub">Per Person • 100/200 Guests</span>
              </button>
              <button
                className={`cp-category-btn ${pkgCategory === 'restaurant' ? 'active' : ''}`}
                onClick={() => { setPkgCategory('restaurant'); setSelectedPackage(''); setShowAllPackages(false); }}
              >
                🍽️ Restaurant Packages
                <span className="cp-category-sub">Flat Rate • No Guest Limit</span>
              </button>
            </div>

            {/* Guest Filter - Only for Catering */}
            {pkgCategory === 'catering' && (
              <div className="cp-pkgs-filter">
                {[
                  { key: 'all', label: 'All Packages (19)' },
                  { key: '100', label: '100 Guests (7)' },
                  { key: '200', label: '200 Guests (12)' },
                ].map(f => (
                  <button
                    key={f.key}
                    className={`cp-filter-btn ${pkgFilter === f.key ? 'active' : ''}`}
                    onClick={() => { setPkgFilter(f.key); setShowAllPackages(false); }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}

            <div className="cp-pkgs-grid">
              {displayPackages.map((pkg, idx) => (
                <Reveal key={pkg.id} delay={idx * 80}>
                  <div
                    className={`cp-pkg-card ${selectedPackage === pkg.id ? 'selected' : ''} ${pkg.guests === 200 ? 'cp-pkg-card-200' : ''} ${pkgCategory === 'restaurant' ? 'cp-restaurant-card' : ''}`}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    <div className="cp-pkg-header">
                      <div className={`cp-pkg-number ${pkg.guests === 200 ? 'cp-pkg-number-200' : ''} ${pkgCategory === 'restaurant' ? 'cp-restaurant-number' : ''}`}>
                        {pkgCategory === 'restaurant' ? pkg.name : String(idx + 1).padStart(2, '0')}
                      </div>
                      <div className="cp-pkg-header-info">
                        {pkgCategory === 'catering' && <div className="cp-pkg-guests-badge">{pkg.guests} Guests</div>}
                        {pkgCategory === 'restaurant' && <div className="cp-pkg-guests-badge flat">Flat Rate</div>}
                        <h3 className="cp-pkg-name">{pkgCategory === 'restaurant' ? 'Event Package' : pkg.name}</h3>
                      </div>
                    </div>
                    <div className="cp-pkg-body">
                      {pkgCategory === 'catering' ? (
                        <>
                          <div className="cp-pkg-price-row">
                            <span className="cp-pkg-price">Rs. {pkg.pricePerPerson.toLocaleString()}</span>
                            <span className="cp-pkg-unit">/person</span>
                          </div>
                          <div className="cp-pkg-total">Min {pkg.guests} guests • Total: Rs. {(pkg.pricePerPerson * pkg.guests).toLocaleString()}</div>
                        </>
                      ) : (
                        <>
                          <div className="cp-pkg-price-row">
                            <span className="cp-pkg-price">Rs. {pkg.price.toLocaleString()}</span>
                            <span className="cp-pkg-unit flat">Fixed Price</span>
                          </div>
                          <div className="cp-pkg-total flat">No minimum guests required</div>
                        </>
                      )}
                      <ul className="cp-pkg-items">
                        {pkg.items.map((item, i) => (
                          <li key={i}>
                            <span className="cp-pkg-check">✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                      <button
                        className="cp-pkg-select-btn"
                        onClick={(e) => { e.stopPropagation(); setSelectedPackage(pkg.id); scrollToForm(); }}
                      >
                        {selectedPackage === pkg.id ? '✓ Selected' : 'Select & Book'}
                      </button>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {filteredPackages.length > initialCount && (
              <div className="cp-show-more-wrap">
                <button className="cp-show-more-btn" onClick={() => setShowAllPackages(!showAllPackages)}>
                  {showAllPackages ? <>Show Less ↑</> : <>Show {filteredPackages.length - initialCount} More Packages ↓</>}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ══════════ BRANCHES — horizontal scroll ══════════ */}
        <section className="cp-branch-sec">
          <div className="cp-inner">
            <div className="cp-branches-header">
              <span className="cp-branches-label">Select Location</span>
              <span className="cp-branches-line" />
            </div>
            <div
              className="cp-branches-inner"
              ref={branchesRef}
              onMouseDown={handleBranchMouseDown}
              onMouseLeave={handleBranchMouseUp}
              onMouseUp={handleBranchMouseUp}
              onMouseMove={handleBranchMouseMove}
            >
              {branches.map(b => (
                <button
                  key={b.id}
                  className={'cp-branch-tab' + (selectedBranch === b.id ? ' active' : '')}
                  onClick={() => setSelectedBranch(b.id)}
                >
                  <span className="cp-branch-check">✓</span>
                  <span className="cp-branch-tag">{b.tag}</span>
                  <div className="cp-branch-name">{b.name}</div>
                  <div className="cp-branch-addr">{b.address}</div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ FORM ══════════ */}
        <section className="cp-form-sec" ref={formRef}>
          <div className="cp-inner">
            <Reveal>
              <span className="cp-sec-label">Book Now</span>
              <h2 className="cp-sec-title">Request a <em>Quote</em></h2>
            </Reveal>
            <Reveal delay={100}>
              <div className="cp-form-layout">
                {/* FORM */}
                <div className="cp-form-container">
                  <p className="cp-form-container-title">Event Details</p>
                  <p className="cp-form-container-sub">Fill in your event information and we'll get back to you promptly</p>

                  <form onSubmit={handleSubmit}>
                    <div className="cp-form-group">
                      <label className="cp-form-label">Event Type <span>*</span></label>
                      <div className="cp-event-grid">
                        {eventTypes.map((type) => (
                          <button
                            key={type.id} type="button"
                            className={`cp-event-btn ${eventType === type.id ? 'selected' : ''}`}
                            onClick={() => setEventType(type.id)}
                          >
                            <span>{type.icon}</span>
                            {type.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="cp-form-divider" />

                    <div className="cp-form-row">
                      <div className="cp-form-group">
                        <label className="cp-form-label">Number of Guests <span>*</span></label>
                        <input
                          type="number" className="cp-form-input"
                          value={guests} onChange={e => setGuests(e.target.value)}
                          required min="50" placeholder="Min. 50 guests"
                        />
                      </div>
                      <div className="cp-form-group">
                        <label className="cp-form-label">Event Date <span>*</span></label>
                        <input
                          type="date" className="cp-form-input"
                          value={date} onChange={e => setDate(e.target.value)}
                          required min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>

                    <div className="cp-form-group">
                      <label className="cp-form-label">Selected Branch <span>*</span></label>
                      <div className="cp-branch-select-grid">
                        {branches.map((b) => (
                          <button
                            key={b.id} type="button"
                            className={`cp-branch-select-btn ${selectedBranch === b.id ? 'selected' : ''}`}
                            onClick={() => setSelectedBranch(b.id)}
                          >
                            <span className="cp-branch-select-check">{selectedBranch === b.id ? '✓' : ''}</span>
                            <span className="cp-branch-select-name">{b.name}</span>
                            <span className="cp-branch-select-tag">{b.tag}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="cp-form-group">
                      <label className="cp-form-label">Selected Package <span>*</span></label>
                      {selectedPackage ? (
                        <div className="cp-selected-pkg-field">
                          <span>
                            {pkgCategory === 'catering' 
                              ? `${selectedPkg?.name} — Rs. ${selectedPkg?.pricePerPerson?.toLocaleString()}/person (min ${selectedPkg?.guests} guests)`
                              : `${selectedPkg?.name} — Rs. ${selectedPkg?.price?.toLocaleString()} (Fixed Price)`
                            }
                          </span>
                          <button type="button" className="cp-pkg-select-btn" style={{width:'auto',padding:'4px 10px',marginTop:0,fontSize:12}} onClick={() => setSelectedPackage('')}>✕ Clear</button>
                        </div>
                      ) : (
                        <div className="cp-selected-pkg-field empty">
                          <span>↑ Select a package from above</span>
                        </div>
                      )}
                    </div>

                    <div className="cp-form-group">
                      <label className="cp-form-label">Special Requirements</label>
                      <textarea
                        className="cp-form-textarea"
                        value={requests} onChange={e => setRequests(e.target.value)}
                        rows="3"
                        placeholder="Custom menu requests, dietary restrictions, venue details..."
                      />
                    </div>

                    <button type="submit" className="cp-submit-btn">
                      <span>Send via WhatsApp</span>
                      <span>→</span>
                    </button>
                  </form>
                </div>

                {/* ORDER SUMMARY */}
                <div className="cp-summary-card">
                  <p className="cp-summary-title">Booking Summary</p>

                  {!selectedPackage ? (
                    <div className="cp-summary-empty">
                      <div className="cp-summary-empty-icon">📋</div>
                      <p className="cp-summary-empty-text">Select a package above to see your booking summary here</p>
                    </div>
                  ) : (
                    <>
                      <p className="cp-summary-pkg-name">{selectedPkg?.name}</p>
                      <div className="cp-summary-pkg-badge">
                        {pkgCategory === 'catering' 
                          ? <><span>👥</span> {selectedPkg?.guests} Guests Min</>
                          : <><span>🍽️</span> Flat Rate Package</>
                        }
                      </div>

                      <div className="cp-summary-divider" />

                      {pkgCategory === 'catering' ? (
                        <div className="cp-summary-row">
                          <span className="cp-summary-row-label">Price per person</span>
                          <span className="cp-summary-row-val">Rs. {selectedPkg?.pricePerPerson?.toLocaleString()}</span>
                        </div>
                      ) : (
                        <div className="cp-summary-row">
                          <span className="cp-summary-row-label">Package Price</span>
                          <span className="cp-summary-row-val">Rs. {selectedPkg?.price?.toLocaleString()}</span>
                        </div>
                      )}
                      {guests && (
                        <div className="cp-summary-row">
                          <span className="cp-summary-row-label">Your guests</span>
                          <span className="cp-summary-row-val">{guests} people</span>
                        </div>
                      )}
                      {eventType && (
                        <div className="cp-summary-row">
                          <span className="cp-summary-row-label">Event type</span>
                          <span className="cp-summary-row-val">{eventTypes.find(e => e.id === eventType)?.name}</span>
                        </div>
                      )}
                      {date && (
                        <div className="cp-summary-row">
                          <span className="cp-summary-row-label">Date</span>
                          <span className="cp-summary-row-val">{new Date(date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      )}

                      <div className="cp-summary-total-row">
                        <span className="cp-summary-total-label">Estimated Total</span>
                        <span className="cp-summary-total-val">
                          Rs. {guests
                            ? (selectedPkg.pricePerPerson * parseInt(guests)).toLocaleString()
                            : (selectedPkg.pricePerPerson * selectedPkg.guests).toLocaleString()}
                        </span>
                      </div>

                      <div className="cp-summary-items-preview">
                        <p className="cp-summary-items-title">Includes</p>
                        {selectedPkg?.items.map((item, i) => (
                          <div key={i} className="cp-summary-item">
                            <span className="cp-summary-item-dot" />
                            {item}
                          </div>
                        ))}
                      </div>

                      <div className="cp-summary-branch">
                        <span className="cp-summary-branch-label">Selected Branch</span>
                        <p className="cp-summary-branch-name">📍 {selectedBranchData?.name}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════ CONTACT ══════════ */}
        <section className="cp-contact-sec">
          <div className="cp-inner">
            <Reveal>
              <div className="cp-contact-inner">
                <h3 className="cp-contact-title">Prefer to Call?</h3>
                <p className="cp-contact-sub">Our catering team is available to discuss your requirements and help you choose the perfect package</p>
                <div className="cp-contact-phones">
                  {[
                    { label: 'Main Line', num: contactInfo.cell },
                    { label: 'Head Office', num: contactInfo.headOffice },
                  ].map(p => (
                    <div key={p.num} className="cp-contact-phone-item">
                      <span className="cp-contact-phone-label">{p.label}</span>
                      <span className="cp-contact-phone-num">📞 {p.num}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
}