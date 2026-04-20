import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { generateBallroomMessage, sendWhatsAppMessage } from '../hooks';

const eventTypes = [
  { id: 'wedding', name: 'Wedding Reception', icon: '💒' },
  { id: 'corporate', name: 'Corporate Event', icon: '💼' },
  { id: 'birthday', name: 'Birthday Celebration', icon: '🎂' },
  { id: 'mehndi', name: 'Mehndi / Sangeet', icon: '🌸' },
  { id: 'engagement', name: 'Engagement Party', icon: '💍' },
  { id: 'other', name: 'Other Special Event', icon: '🎉' }
];

const stats = [
  { icon: '👥', value: '200', label: 'Guest Capacity' },
  { icon: '⏱️', value: '12 AM', label: 'Last Event Time' },
  { icon: '🚗', value: '200+', label: 'Parking' },
  { icon: '⭐', value: '4.9', label: 'Rating' }
];

// 3 Halls at Nagan Head Office
const halls = [
  {
    id: 'hall-a',
    name: 'Hall A',
    title: 'The Grand Hall',
    icon: '👑',
    capacity: '200 persons',
    description: 'Our largest hall, perfect for grand weddings and receptions with elegant chandelier lighting.',
    charge: 'PKR 45,000',
    videoUrl: "/Hall/Hall-A.mp4",
    poster: "/Hall/hall-a-poster.jpg",
    features: ['Chandelier Lighting', 'Bridal Suite', 'VIP Lounge', 'No Music']
  },
  {
    id: 'hall-b',
    name: 'Hall B',
    title: 'The Royal Hall',
    icon: '💎',
    capacity: '120 persons',
    description: 'Medium-sized hall ideal for corporate events, engagements, and birthday celebrations.',
    charge: 'PKR 35,000',
    videoUrl: '/Hall/Hall-B.mp4',
    poster: "/Hall/hall-b-poster.jpg",
    features: ['Modern AV System', 'Stage Setup', 'Dance Floor', 'No Music']
  },
  {
    id: 'hall-c',
    name: 'Hall C',
    title: 'The Pearl Hall',
    icon: '🌟',
    capacity: '60 persons',
    description: 'Intimate setting perfect for small gatherings, mehndi ceremonies, and private parties.',
    charge: 'PKR 25,000',
    videoUrl: '/Hall/Hall-C.mp4',
    poster: "/Hall/hall-c-poster.jpg",
    features: ['Cozy Ambiance', 'Garden View', 'Private Entrance', 'No Music']
  }
];

// Ballroom Food Packages
const packages = [
  // Hall A & B Packages (Min 100 Guests) - Exactly as per images
  {
    id: 'pkg-a-01',
    name: 'Package 01',
    halls: ['Hall A', 'Hall B'],
    minGuests: 100,
    prices: { 'Hall A': 1520, 'Hall B': 1420 },
    items: ['Chicken Biryani', 'Chicken Koyla Karahi', 'Chicken Handi Kabab', 'Chicken Bihari Tikka (12pcs)', 'Ice Cream Cattle', 'Gulab Jamun', 'Milky Naan', 'Taftan', 'Greeb Salad Platter', 'Raita', 'Water + Cold Drink']
  },
  {
    id: 'pkg-a-02',
    name: 'Package 02',
    halls: ['Hall A', 'Hall B'],
    minGuests: 100,
    prices: { 'Hall A': 1350, 'Hall B': 1250 },
    items: ['Beef Biryani Boneless', 'Chicken Koyla Karahi', 'Chicken Qeema Masala', 'Singaporean Rice', 'Wonton', 'Ice Cream Cattle', 'Milky Naan', 'Taftan', 'Green Salad Platter', 'Raita', 'Water + Cold Drink']
  },
  {
    id: 'pkg-a-03',
    name: 'Package 03',
    halls: ['Hall A', 'Hall B'],
    minGuests: 100,
    prices: { 'Hall A': 1250, 'Hall B': 1150 },
    items: ['Welcome Drink', 'Beef Biryani Boneless', 'Chicken Tikka Karahi', 'Rabri Kheer', 'Wonton', 'Milky Naan', 'Taftan', 'Green Salad Platter', 'Salad', 'Raita', 'Water + Cold Drink']
  },
  {
    id: 'pkg-a-04',
    name: 'Package 04',
    halls: ['Hall A', 'Hall B'],
    minGuests: 100,
    prices: { 'Hall A': 1270, 'Hall B': 1170 },
    items: ['Beef Biryani Boneeless', 'Chicken Tikka Karahi/ White Karahi', 'Chicken Chowmein', 'Lub-e-Sheeren / Rabri Kheer', 'Milky Naan', 'Taftan', 'Salad Platter / Russian Salad Platter', 'Raita', 'Water + Cold Drink']
  },
  {
    id: 'pkg-a-05',
    name: 'Package 05',
    halls: ['Hall A', 'Hall B'],
    minGuests: 100,
    prices: { 'Hall A': 1370, 'Hall B': 1270 },
    items: ['Chicken Biryani', 'Chicken Tikka Karahi / Live Koyla Karahi', 'Chicken Bihari Tikka / Malai Tikka / Chicken Chaanp', 'Ice Cream Cattle / Cream Cattle / Doodh Dulhari', 'Milky Naan', 'Taftan', 'Salad Platter / Russian Salad Platter', 'Raita', 'Water + Cold Drink']
  },
  {
    id: 'pkg-a-06',
    name: 'Package 06',
    halls: ['Hall A', 'Hall B'],
    minGuests: 100,
    prices: { 'Hall A': 1270, 'Hall B': 1170 },
    items: ['Chicken Biryani / Pulao',  'Chicken Tikka Karahi / Shinwari Karahi / Peshawari Karahi Live', 'Chicken Bihari Tikka / Chicken Steam Foil / Malai Tikka', 'Ice Cream Cattle / Gajar Ka Halwa / Rabri Falooda Kheer', 'Milky Naan', 'Taftan', 'Green Salad Platter / Russian Salad Platter', 'Raita', 'Water + Cold Drink']
  },
  {
    id: 'pkg-a-07',
    name: 'Package 07',
    halls: ['Hall A', 'Hall B'],
    minGuests: 100,
    prices: { 'Hall A': 1050, 'Hall B': 950 },
    items: ['Chicken Biryani', 'Chicken Tikka Karahi/ White Karahi', 'Rabri Kheer / Fruit Truffle',  'Milky Naan', 'Taftan', 'Green Salad Platter / Russian Salad Platter', 'Raita', 'Naan', 'Water + Cold Drink']
  },
  // Hall C Packages (Min 50 Guests) - Image 2
  {
    id: 'pkg-c-01',
    name: 'Package 01',
    halls: ['Hall C'],
    minGuests: 50,
    prices: { 'Hall C': 1400 },
    items: ['Chicken Biryani', 'Chicken Tikka Karahi/ Badami Qorma', 'Chicken Bihari Tikka / Malai Tikka', 'Ice Cream Cattle / Doodh Dulhari', 'Roti', 'Taftaan', 'Russin / Green Salad Platter', 'Raita', 'Cold Drink (NR 345ml)', 'Mineral Water 1.5ltr']
  },
  {
    id: 'pkg-c-02',
    name: 'Package 02',
    halls: ['Hall C'],
    minGuests: 50,
    prices: { 'Hall C': 1380 },
    items: ['Beef Biryani Boneless', 'Chicken Tikka Karahi / Chicken White Karahi', 'Chicken Chowmein', 'Lub-e-Sheeren / Fruit Truffle', 'Roti', 'Taftan', 'Russian / Green Salad Platter', 'Raita', 'Cold Drink (NR 345ml)', 'Mineral Water 1.5ltr']
  },
  {
    id: 'pkg-c-03',
    name: 'Package 03',
    halls: ['Hall C'],
    minGuests: 50,
    prices: { 'Hall C': 1200 },
    items: ['Chicken Biryani', 'Chicken White Karahi / White Qorma', 'Lub-e-Sheeren / Rabri Kheer', 'Roti', 'Taftan', 'Russian / Green Salad Platter', 'Raita', 'Cold Drink (NR 345ml)', 'Mineral Water 1.5ltr']
  },
  {
    id: 'pkg-c-04',
    name: 'Package 04',
    halls: ['Hall C'],
    minGuests: 50,
    prices: { 'Hall C': 1450 },
    items: ['Beef Biryani Boneless', 'Chicken Qeema Masala', 'Chicken Koyla Karahi', 'Singaporean Rice', 'Wonton', 'Doodh Dulhari / Ice Cream Cattle', 'Roti', 'Taftan', 'Russian / Green Salad Platter', 'Raita', 'Cold Drink (NR 345ml)', 'Mineral Water 1.5ltr']
  },
  {
    id: 'pkg-c-05',
    name: 'Package 05',
    halls: ['Hall C'],
    minGuests: 50,
    prices: { 'Hall C': 1375 },
    items: ['Welcome Drink', 'Wonton', 'Beef Biryani Boneless', 'Chicken Badami Qorma', 'Rabri Ice Falooda Kheer / Fruit Truffle', 'Roti', 'Taftan', 'Russian / Green Salad Platter', 'Raita', 'Cold Drink (NR 345ml)', 'Mineral Water 1.5ltr']
  },
  {
    id: 'pkg-c-06',
    name: 'Package 06',
    halls: ['Hall C'],
    minGuests: 50,
    popular: true,
    prices: { 'Hall C': 1600 },
    items: ['Chicken Biryani', 'Chicken Koyla Karahi', 'Chicken Handi Kabab / Angaara Kabab', 'Chicken Chaanp / Chicken Malai Tikka', 'Ice Cream Cattle', 'Gulab Jamun', 'Roti', 'Taftan', 'Russian / Green Salad Platter', 'Raita', 'Cold Drink (NR 345ml)', 'Mineral Water 1.5ltr']
  }
];

/* ── Reveal hook ── */
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

/* ══════════════════════════════════════════════════════════════════
   PREMIUM CSS
══════════════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.bp-root {
  min-height: 100vh;
  background: #080808;
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #fff;
  overflow-x: hidden;
}

/* reveal */
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

/* ── HERO ── */
.bp-hero {
  position: relative;
  min-height: 500px;
  display: flex;
  align-items: stretch;
  overflow: hidden;
  background: #080808;
}

/* Left dark panel */
.bp-hero-panel-left {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 130px 48px 64px 80px;
  z-index: 2;
}

/* Right cream panel */
.bp-hero-panel-right {
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
.bp-hero-panel-right::before {
  content: '';
  position: absolute;
  top: -80px; right: -80px;
  width: 300px; height: 300px;
  border-radius: 50%;
  background: rgba(200,16,46,0.06);
  z-index: 0;
}
.bp-hero-panel-right::after {
  content: '';
  position: absolute;
  bottom: -60px; left: -60px;
  width: 250px; height: 250px;
  border-radius: 50%;
  background: rgba(200,16,46,0.04);
  z-index: 0;
}

/* Diagonal separator */
.bp-hero-divider-line {
  position: absolute;
  top: 0; bottom: 0;
  width: 64px;
  background: #F5E6C8;
  clip-path: polygon(60% 0%, 100% 0%, 100% 100%, 0% 100%);
  z-index: 3;
  right: 380px;
}

.bp-hero-bg {
  position: absolute; inset: 0; z-index: 0;
  background:
    radial-gradient(ellipse 60% 80% at 20% 60%, rgba(200,16,46,0.1) 0%, transparent 65%),
    radial-gradient(ellipse 40% 50% at 60% 20%, rgba(0,33,100,0.06) 0%, transparent 50%);
}
.bp-hero-grid {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(245,230,200,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(245,230,200,0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 70% 90% at 30% 60%, black 20%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 70% 90% at 30% 60%, black 20%, transparent 80%);
}
.bp-hero-accent {
  position: absolute; top: 0; left: 0; right: 0; height: 2px; z-index: 5;
  background: linear-gradient(90deg, transparent 0%, #C8102E 25%, #F5E6C8 50%, #C8102E 75%, transparent 100%);
}

.bp-hero-eyebrow {
  display: inline-flex; align-items: center; gap: 10px;
  background: rgba(200,16,46,0.1);
  border: 1px solid rgba(200,16,46,0.2);
  padding: 8px 18px; border-radius: 50px;
  font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase;
  color: #e87a8a; font-weight: 600; margin-bottom: 28px;
  animation: fadeUp 0.7s 0.1s both;
  width: fit-content;
}
.bp-hero-eyebrow-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #C8102E; animation: pulse-ring 2s infinite;
}
.bp-hero-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(38px, 5.5vw, 68px);
  font-weight: 700; line-height: 1.1;
  letter-spacing: -0.025em; color: #fff;
  animation: fadeUp 0.7s 0.2s both;
  margin-bottom: 20px;
}
.bp-hero-title em {
  font-style: italic; font-weight: 400;
  color: #F5E6C8; display: block;
}
.bp-hero-desc {
  font-size: 15px; color: rgba(255,255,255,0.5);
  line-height: 1.8; max-width: 460px;
  animation: fadeUp 0.7s 0.3s both;
}

/* RIGHT PANEL — cream content */
.bp-hero-cream-label {
  position: relative; z-index: 1;
  font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase;
  color: #C8102E; font-weight: 700; margin-bottom: 20px;
  display: flex; align-items: center; gap: 8px;
  animation: fadeUp 0.7s 0.2s both;
}
.bp-hero-cream-label::before {
  content: ''; width: 20px; height: 1px; background: #C8102E;
}
.bp-hero-stats-list {
  position: relative; z-index: 1;
  display: flex; flex-direction: column; gap: 20px;
  animation: fadeUp 0.7s 0.3s both;
}
.bp-hero-stat-item {
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(42,26,0,0.1);
}
.bp-hero-stat-item:last-child { border-bottom: none; padding-bottom: 0; }
.bp-hero-stat-num {
  font-family: 'Playfair Display', serif;
  font-size: 44px; font-weight: 700;
  color: #C8102E; line-height: 1;
}
.bp-hero-stat-lbl {
  font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
  color: #8C6A3A; font-weight: 600; margin-top: 4px;
}
.bp-hero-cream-badge {
  position: relative; z-index: 1;
  margin-top: 28px;
  background: rgba(200,16,46,0.1);
  border: 1px solid rgba(200,16,46,0.2);
  border-radius: 10px; padding: 14px 16px;
  animation: fadeUp 0.7s 0.4s both;
}
.bp-hero-cream-badge-title {
  font-size: 11px; font-weight: 700; color: #C8102E;
  letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px;
}
.bp-hero-cream-badge-text {
  font-size: 13px; color: #5a3a1a; line-height: 1.5;
}

/* Mobile stats */
.bp-hero-mobile-stats {
  display: none;
  margin-top: 24px;
  animation: fadeUp 0.7s 0.4s both;
}
.bp-hero-mobile-stat {
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; color: rgba(255,255,255,0.6);
}
.bp-hero-mobile-stat span { color: #F5E6C8; font-weight: 600; }

.bp-inner {
  max-width: 1280px; margin: 0 auto; padding: 0 48px;
}

.bp-sec-label {
  font-size: 11px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: #C8102E;
  font-weight: 600;
  display: block;
  margin-bottom: 12px;
}
.bp-sec-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
  margin-bottom: 40px;
}
.bp-sec-title em { font-style: italic; font-weight: 400; color: #FBE8CB; }

/* ── FORM ── */
.bp-form-sec {
  background: #0a0a0a;
  padding: 80px 0;
}
.bp-form-container {
  max-width: 800px;
  margin: 0 auto;
  background: #111;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 20px;
  padding: 48px;
}
.bp-form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.bp-form-group { margin-bottom: 24px; }
.bp-form-label {
  display: block;
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.6);
  margin-bottom: 10px;
  font-weight: 600;
}
.bp-form-input, .bp-form-textarea, .bp-form-select {
  width: 100%;
  padding: 14px 16px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  color: #fff;
  font-size: 15px;
  border-radius: 10px;
  transition: all 0.3s ease;
}
.bp-form-input:focus, .bp-form-textarea:focus, .bp-form-select:focus {
  outline: none;
  border-color: #C8102E;
  background: rgba(200,16,46,0.05);
}
.bp-event-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.bp-event-btn {
  padding: 16px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  transition: all 0.3s ease;
}
.bp-event-btn span { font-size: 20px; }
.bp-event-btn:hover, .bp-event-btn.selected {
  border-color: #C8102E;
  background: rgba(200,16,46,0.1);
}
.bp-event-btn.selected {
  background: #C8102E;
  border-color: #C8102E;
}
.bp-submit-btn {
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, #C8102E 0%, #a00d25 100%);
  border: none;
  color: #fff;
  font-size: 13px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 600;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s ease;
}
.bp-submit-btn:hover {
  background: linear-gradient(135deg, #0033A0 0%, #001f6e 100%);
  transform: translateY(-2px);
}

/* ── GALLERY ── */
.bp-gallery-sec {
  background: #FBE8CB;
  padding: 80px 0;
}
.bp-gallery-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 200px);
  gap: 16px;
}
.bp-gallery-item {
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  transition: all 0.3s ease;
}
.bp-gallery-item:hover {
  transform: scale(1.02);
}
.bp-gallery-large {
  grid-column: span 2;
  grid-row: span 2;
  font-size: 60px;
}
.bp-gallery-wide {
  grid-column: span 2;
  font-size: 50px;
}

/* ── CONTACT ── */
.bp-contact-sec {
  background: #080808;
  padding: 60px 0 100px;
  text-align: center;
}
.bp-contact-title {
  font-family: 'Playfair Display', serif;
  font-size: 28px;
  color: #C8102E;
  margin-bottom: 16px;
}
.bp-contact-phone {
  font-family: 'Playfair Display', serif;
  font-size: 36px;
  color: #fff;
  font-weight: 700;
}

/* ── RESPONSIVE ── */
@media (max-width: 1200px) {
  .bp-hero-panel-right { width: 300px; }
  .bp-hero-divider-line { right: 300px; }
}
@media (max-width: 1024px) {
  .bp-event-grid { grid-template-columns: repeat(2, 1fr); }
  .bp-hero-panel-right { display: none; }
  .bp-hero-divider-line { display: none; }
  .bp-hero-panel-left { padding: 110px 40px 64px 60px; }
  .bp-hero-mobile-stats { display: flex; flex-wrap: wrap; gap: 16px 24px; }
  .bp-form-grid { grid-template-columns: 1fr; }
  .bp-gallery-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 150px);
  }
  .bp-gallery-large { grid-column: span 2; grid-row: span 1; }
}
@media (max-width: 768px) {
  .bp-inner { padding: 0 20px; }
  .bp-hero-panel-left { padding: 100px 24px 48px 32px; }
  .bp-form-container { padding: 28px; }
  .bp-gallery-grid { grid-template-columns: 1fr; }
  .bp-gallery-large, .bp-gallery-wide { grid-column: span 1; }
  .bp-packages-grid { grid-template-columns: 1fr; }
}

/* ── COMPLETE VIDEO GALLERY ── */
.bp-video-gallery-sec {
  background: #0a0a0a;
  padding: 100px 0;
  position: relative;
}
.bp-video-gallery-sec::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(200,16,46,0.3), transparent);
}
.bp-gallery-header {
  text-align: center;
  margin-bottom: 60px;
}
.bp-gallery-header h2 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;
}
.bp-gallery-header h2 em {
  font-style: italic;
  font-weight: 400;
  color: #F5E6C8;
}
.bp-gallery-header p {
  font-size: 16px;
  color: rgba(255,255,255,0.5);
  max-width: 600px;
  margin: 0 auto;
}

/* Hall Row - Alternating Layout (Seamless) */
.bp-hall-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  margin-bottom: 120px;
  position: relative;
}
.bp-hall-row:last-child {
  margin-bottom: 0;
}
.bp-hall-row::after {
  content: '';
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(200,16,46,0.3), transparent);
}
.bp-hall-row:last-child::after {
  display: none;
}

/* Hall B - Swapped (Video Left, Text Right) */
.bp-hall-row.swapped {
  direction: rtl;
}
.bp-hall-row.swapped > * {
  direction: ltr;
}

/* Hall Content (Text Side) */
.bp-hall-content {
  padding: 48px 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.bp-hall-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(200,16,46,0.1);
  border: 1px solid rgba(200,16,46,0.2);
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 12px;
  color: #C8102E;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  width: fit-content;
  margin-bottom: 20px;
}
.bp-hall-content h3 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
  line-height: 1.2;
}
.bp-hall-content h3 span {
  color: #F5E6C8;
  font-weight: 400;
  font-style: italic;
}
.bp-hall-capacity-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: rgba(255,255,255,0.6);
  margin-bottom: 20px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.bp-hall-description {
  font-size: 15px;
  color: rgba(255,255,255,0.55);
  line-height: 1.8;
  margin-bottom: 28px;
}
.bp-hall-features-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.bp-hall-feature-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: rgba(245,230,200,0.05);
  border: 1px solid rgba(245,230,200,0.1);
  border-radius: 50px;
  font-size: 13px;
  color: #F5E6C8;
  transition: all 0.3s ease;
}
.bp-hall-feature-item:hover {
  background: rgba(245,230,200,0.1);
  border-color: rgba(245,230,200,0.2);
}
.bp-hall-feature-item::before {
  content: '✓';
  color: #C8102E;
  font-weight: 700;
}

/* Hall Video Side */
.bp-hall-video-wrap {
  position: relative;
  background: #000;
  overflow: hidden;
  min-height: 450px;
  border-radius: 16px;
}
.bp-hall-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  inset: 0;
}
.bp-hall-video-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
  color: rgba(255,255,255,0.5);
}
.bp-hall-video-placeholder span {
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.6;
}
.bp-hall-video-placeholder p {
  font-size: 14px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.bp-hall-video-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.6) 100%);
  pointer-events: none;
}
.bp-hall-video-label {
  position: absolute;
  bottom: 24px;
  left: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(200,16,46,0.9);
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 12px;
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.bp-hall-video-label::before {
  content: '';
  width: 8px;
  height: 8px;
  background: #ff3333;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* Video Play Button */
.bp-video-play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: rgba(200, 16, 46, 0.9);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  z-index: 10;
}
.bp-video-play-btn:hover {
  background: rgba(200, 16, 46, 1);
  transform: translate(-50%, -50%) scale(1.1);
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.5);
}
.bp-video-play-btn svg {
  width: 32px;
  height: 32px;
  fill: white;
}
/* Smaller button when video is playing (for pause) */
.bp-video-play-btn.paused {
  width: 50px;
  height: 50px;
  opacity: 0.7;
}
.bp-video-play-btn.paused:hover {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1.05);
}
.bp-video-play-btn.paused svg {
  width: 20px;
  height: 20px;
}
@media (max-width: 768px) {
  .bp-video-play-btn {
    width: 60px;
    height: 60px;
  }
  .bp-video-play-btn svg {
    width: 24px;
    height: 24px;
  }
  .bp-video-play-btn.paused {
    width: 40px;
    height: 40px;
  }
  .bp-video-play-btn.paused svg {
    width: 16px;
    height: 16px;
  }
}

/* Video Gallery Responsive */
@media (max-width: 968px) {
  .bp-hall-row,
  .bp-hall-row.swapped {
    grid-template-columns: 1fr;
    direction: ltr;
    margin-bottom: 80px;
    gap: 32px;
  }
  .bp-hall-row.swapped > * {
    direction: ltr;
  }
  .bp-hall-row::after {
    bottom: -40px;
  }
  .bp-hall-content {
    padding: 0 20px;
    order: 2;
    margin-bottom: 24px;
  }
  .bp-hall-video-wrap {
    min-height: 300px;
    order: 1;
    border-radius: 12px;
    margin: 24px 20px 0;
  }
}
@media (max-width: 600px) {
  .bp-hall-content {
    padding: 0 16px;
    margin-bottom: 20px;
  }
  .bp-hall-video-wrap {
    min-height: 250px;
    margin: 20px 16px 0;
    border-radius: 8px;
  }
  .bp-gallery-header h2 {
    font-size: 28px;
  }
  .bp-hall-content h3 {
    font-size: 24px;
  }
  .bp-hall-feature-item {
    font-size: 12px;
    padding: 8px 14px;
  }
}

/* ── PACKAGES SECTION ── */
.bp-packages-sec {
  background: #FBE8CB;
  padding: 80px 0;
  position: relative;
}
.bp-packages-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

/* Hall Filter Tabs */
.bp-hall-tabs {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 48px;
  flex-wrap: wrap;
}
.bp-hall-tab {
  padding: 14px 28px;
  background: #fff;
  border: 2px solid transparent;
  border-radius: 12px;
  color: #5a4030;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}
.bp-hall-tab:hover {
  border-color: #C8102E;
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}
.bp-hall-tab.active {
  background: #C8102E;
  color: #fff;
  border-color: #C8102E;
}
.bp-tab-badge {
  font-size: 10px;
  font-weight: 500;
  opacity: 0.8;
}
.bp-hall-tab.active .bp-tab-badge {
  color: rgba(255,255,255,0.9);
}
.bp-package-card {
  background: rgba(255,255,255,0.03);
  border-radius: 20px;
  padding: 32px;
  border: 1px solid rgba(245,230,200,0.1);
  transition: all 0.3s ease;
  position: relative;
  backdrop-filter: blur(10px);
}
.bp-package-card:hover {
  transform: translateY(-8px);
  background: rgba(255,255,255,0.05);
  border-color: rgba(245,230,200,0.2);
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
}
.bp-package-card.popular {
  border-color: #C8102E;
  background: rgba(200,16,46,0.08);
}
.bp-package-card.popular:hover {
  border-color: #e6123a;
  background: rgba(200,16,46,0.12);
}
.bp-package-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #C8102E;
  color: #fff;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.bp-package-icon {
  font-size: 48px;
  text-align: center;
  margin-bottom: 16px;
}
.bp-package-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  color: #F5E6C8;
  text-align: center;
  margin-bottom: 8px;
}
.bp-package-price {
  font-size: 28px;
  font-weight: 700;
  color: #C8102E;
  text-align: center;
  margin-bottom: 8px;
}
.bp-package-duration {
  text-align: center;
  font-size: 13px;
  color: rgba(245,230,200,0.6);
  margin-bottom: 24px;
}
.bp-package-list {
  list-style: none;
  margin-bottom: 24px;
}
.bp-package-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  font-size: 13px;
  color: rgba(245,230,200,0.8);
  border-bottom: 1px solid rgba(245,230,200,0.08);
}
.bp-package-list li:last-child { border-bottom: none; }
.bp-package-check {
  width: 20px;
  height: 20px;
  background: rgba(200,16,46,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #C8102E;
  font-weight: bold;
}
.bp-package-btn {
  width: 100%;
  padding: 14px;
  background: #C8102E;
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}
.bp-package-btn:hover { background: #a00d25; }

/* Food Package Cards */
.bp-food-card {
  background: #fff;
  border-radius: 20px;
  padding: 28px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}
.bp-food-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.12);
  border-color: rgba(200,16,46,0.2);
}
.bp-food-card.popular {
  border-color: #C8102E;
  background: linear-gradient(135deg, #fff 0%, rgba(200,16,46,0.05) 100%);
}

.bp-food-pkg-number {
  font-family: 'Playfair Display', serif;
  font-size: 14px;
  font-weight: 600;
  color: #C8102E;
  text-align: center;
  margin-bottom: 4px;
  letter-spacing: 0.1em;
}
.bp-food-pkg-name {
  font-family: 'Playfair Display', serif;
  font-size: 20px;
  font-weight: 600;
  color: #2A1000;
  text-align: center;
  margin-bottom: 16px;
}

.bp-hall-prices-row {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.bp-hall-prices-row.single {
  justify-content: center;
}

.bp-price-pill {
  background: linear-gradient(135deg, #C8102E 0%, #a00d25 100%);
  border-radius: 12px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100px;
}
.bp-price-pill.large {
  padding: 12px 24px;
  min-width: 140px;
}

.bp-pill-label {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.8);
  margin-bottom: 2px;
}
.bp-pill-price {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}

.bp-food-items {
  list-style: none;
  margin-bottom: 20px;
  min-height: 180px;
}
.bp-food-items li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  font-size: 13px;
  color: #5a4030;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}
.bp-food-items li:last-child { border-bottom: none; }

.bp-item-check {
  width: 18px;
  height: 18px;
  background: rgba(200,16,46,0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #C8102E;
  flex-shrink: 0;
}

.bp-more-items {
  font-size: 12px;
  color: #8C6A3A;
  font-style: italic;
}

.bp-show-more-btn {
  background: #C8102E;
  color: #fff;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(200,16,46,0.3);
}
.bp-show-more-btn:hover {
  background: #a00d24;
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(200,16,46,0.4);
}

@media (max-width: 1024px) {
  .bp-packages-grid { grid-template-columns: 1fr; }
  .bp-price-pill { min-width: 90px; padding: 8px 12px; }
  .bp-pill-price { font-size: 13px; }
  .bp-hall-tabs { gap: 10px; }
  .bp-hall-tab { padding: 12px 20px; font-size: 13px; }
}
@media (max-width: 600px) {
  .bp-hall-tab { padding: 10px 16px; font-size: 12px; }
  .bp-tab-badge { font-size: 9px; }
}
`;

export default function BallroomPageNew() {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [guests, setGuests] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [requests, setRequests] = useState('');
  const [selectedHall, setSelectedHall] = useState('hall-a');
  const [selectedHallFilter, setSelectedHallFilter] = useState('all');
  const [visiblePackages, setVisiblePackages] = useState(6);
  const [playingVideo, setPlayingVideo] = useState(null);
  const videoRefs = useRef({});

  // Get initial packages count based on screen size
  const getInitialCount = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      return 3;
    }
    return 6;
  };

  const handleShowMore = () => {
    setVisiblePackages(prev => prev + (window.innerWidth <= 768 ? 3 : 6));
  };

  const handleFilterChange = (filter) => {
    setSelectedHallFilter(filter);
    setVisiblePackages(getInitialCount());
  };

  // Update visible packages on window resize
  useEffect(() => {
    const handleResize = () => {
      const newCount = getInitialCount();
      if (visiblePackages > newCount) {
        setVisiblePackages(newCount);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [visiblePackages]);

  const handleVideoToggle = (hallId) => {
    const video = videoRefs.current[hallId];
    if (!video) return;

    if (playingVideo === hallId) {
      // Pause if already playing
      video.pause();
      setPlayingVideo(null);
    } else {
      // Pause any currently playing video
      if (playingVideo && videoRefs.current[playingVideo]) {
        videoRefs.current[playingVideo].pause();
      }
      // Play the new video
      video.play();
      setPlayingVideo(hallId);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEvent || !guests || !date || !duration) {
      alert('Please fill in all required fields');
      return;
    }
    const eventName = eventTypes.find(t => t.id === selectedEvent)?.name;
    const hallName = halls.find(h => h.id === selectedHall)?.name || 'Hall A';
    const message = generateBallroomMessage(eventName, guests, date, duration, requests, hallName);
    sendWhatsAppMessage('ballroom', message);
  };

  return (
    <>
      <Navbar />
    <div className="bp-root">
      <style>{CSS}</style>

      {/* ── HERO ── */}
      <section className="bp-hero">
        <div className="bp-hero-bg" />
        <div className="bp-hero-grid" />
        <div className="bp-hero-accent" />
        <div className="bp-hero-divider-line" />

        {/* LEFT — dark panel */}
        <div className="bp-hero-panel-left">
          <div className="bp-hero-eyebrow">
            <span className="bp-hero-eyebrow-dot" />
            Premium Venue
          </div>
          <h1 className="bp-hero-title">
            The Royal
            <em>Ballroom</em>
          </h1>
          <p className="bp-hero-desc">
            Step into a world of elegance and grandeur. Our exquisite venue at Nagan Head Office combines traditional charm with modern luxury for your most cherished celebrations.
          </p>
          {/* Mobile stats - shown when right panel hidden */}
          <div className="bp-hero-mobile-stats">
            {stats.slice(0, 3).map((s, i) => (
              <div key={i} className="bp-hero-mobile-stat">
                <span>{s.icon}</span>
                <span>{s.value}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — cream panel */}
        <div className="bp-hero-panel-right">
          <span className="bp-hero-cream-label">At a Glance</span>
          <div className="bp-hero-stats-list">
            {stats.map((s, i) => (
              <div key={i} className="bp-hero-stat-item" style={{ animationDelay: `${0.25 + i * 0.08}s` }}>
                <div className="bp-hero-stat-num">{s.value}</div>
                <div className="bp-hero-stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="bp-hero-cream-badge">
            <div className="bp-hero-cream-badge-title">📍 Location</div>
            <div className="bp-hero-cream-badge-text">Only at Nagan Head Office, Karachi</div>
          </div>
        </div>
      </section>

      {/* ── COMPLETE VIDEO GALLERY ── */}
      <section className="bp-video-gallery-sec">
        <div className="bp-inner">
          <Reveal>
            <div className="bp-gallery-header">
              <span className="bp-sec-label" style={{display:'inline-block', marginBottom:'20px'}}>Virtual Tour</span>
              <h2>Explore Our <em>Magnificent Halls</em></h2>
              <p>Experience the elegance of our three beautifully designed venues, each crafted to make your celebrations unforgettable.</p>
            </div>
          </Reveal>

          {/* Hall A - Text Left, Video Right */}
          <Reveal delay={100}>
            <div className="bp-hall-row">
              <div className="bp-hall-content">
                <span className="bp-hall-badge">Hall A</span>
                <h3>The Grand <span>Hall</span></h3>
                <div className="bp-hall-capacity-badge">
                  <span>👥</span> 200 persons capacity
                </div>
                <p className="bp-hall-description">
                  Our largest and most prestigious hall, designed for grand weddings and lavish receptions. Features stunning chandelier lighting, a private bridal suite, and an exclusive VIP lounge for distinguished guests.
                </p>
                <div className="bp-hall-features-list">
                  <span className="bp-hall-feature-item">Chandelier Lighting</span>
                  <span className="bp-hall-feature-item">Bridal Suite</span>
                  <span className="bp-hall-feature-item">VIP Lounge</span>
                </div>
              </div>
              <div className="bp-hall-video-wrap">
                {halls[0]?.videoUrl ? (
                  <>
                    <video
                      ref={el => videoRefs.current['hall-a'] = el}
                      className="bp-hall-video"
                      src={halls[0].videoUrl}
                      poster={halls[0].poster}
                      muted
                      loop
                      playsInline
                      preload="none"
                      loading="lazy"
                    />
                    <div className="bp-hall-video-overlay" />
                    <div className="bp-hall-video-label">Live Tour</div>
                    <button
                      className={`bp-video-play-btn ${playingVideo === 'hall-a' ? 'paused' : ''}`}
                      onClick={() => handleVideoToggle('hall-a')}
                      aria-label={playingVideo === 'hall-a' ? 'Pause video' : 'Play video'}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        {playingVideo === 'hall-a' ? (
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                        ) : (
                          <path d="M8 5v14l11-7z"/>
                        )}
                      </svg>
                    </button>
                  </>
                ) : (
                  <div className="bp-hall-video-placeholder">
                    <span>👑</span>
                    <p>Grand Hall Video</p>
                  </div>
                )}
              </div>
            </div>
          </Reveal>

          {/* Hall B - Video Left, Text Right (Swapped) */}
          <Reveal delay={150}>
            <div className="bp-hall-row swapped">
              <div className="bp-hall-content">
                <span className="bp-hall-badge">Hall B</span>
                <h3>The Royal <span>Hall</span></h3>
                <div className="bp-hall-capacity-badge">
                  <span>👥</span> 120 persons capacity
                </div>
                <p className="bp-hall-description">
                  A perfectly balanced venue for corporate events, engagements, and birthday celebrations. Equipped with cutting-edge AV systems, professional stage setup, and a spacious dance floor for memorable moments.
                </p>
                <div className="bp-hall-features-list">
                  <span className="bp-hall-feature-item">Modern AV System</span>
                  <span className="bp-hall-feature-item">Stage Setup</span>
                  <span className="bp-hall-feature-item">Dance Floor</span>
                </div>
              </div>
              <div className="bp-hall-video-wrap">
                {halls[1]?.videoUrl ? (
                  <>
                    <video
                      ref={el => videoRefs.current['hall-b'] = el}
                      className="bp-hall-video"
                      src={halls[1].videoUrl}
                      poster={halls[1].poster}
                      muted
                      loop
                      playsInline
                      preload="none"
                      loading="lazy"
                    />
                    <div className="bp-hall-video-overlay" />
                    <div className="bp-hall-video-label">Live Tour</div>
                    <button
                      className={`bp-video-play-btn ${playingVideo === 'hall-b' ? 'paused' : ''}`}
                      onClick={() => handleVideoToggle('hall-b')}
                      aria-label={playingVideo === 'hall-b' ? 'Pause video' : 'Play video'}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        {playingVideo === 'hall-b' ? (
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                        ) : (
                          <path d="M8 5v14l11-7z"/>
                        )}
                      </svg>
                    </button>
                  </>
                ) : (
                  <div className="bp-hall-video-placeholder">
                    <span>💎</span>
                    <p>Royal Hall Video</p>
                  </div>
                )}
              </div>
            </div>
          </Reveal>

          {/* Hall C - Text Left, Video Right */}
          <Reveal delay={200}>
            <div className="bp-hall-row">
              <div className="bp-hall-content">
                <span className="bp-hall-badge">Hall C</span>
                <h3>The Pearl <span>Hall</span></h3>
                <div className="bp-hall-capacity-badge">
                  <span>👥</span> 60 persons capacity
                </div>
                <p className="bp-hall-description">
                  An intimate sanctuary perfect for small gatherings, mehndi ceremonies, and private parties. Enjoy the cozy ambiance, serene garden views, and a private entrance for exclusive celebrations.
                </p>
                <div className="bp-hall-features-list">
                  <span className="bp-hall-feature-item">Cozy Ambiance</span>
                  <span className="bp-hall-feature-item">Garden View</span>
                  <span className="bp-hall-feature-item">Private Entrance</span>
                </div>
              </div>
              <div className="bp-hall-video-wrap">
                {halls[2]?.videoUrl ? (
                  <>
                    <video
                      ref={el => videoRefs.current['hall-c'] = el}
                      className="bp-hall-video"
                      src={halls[2].videoUrl}
                      poster={halls[2].poster}
                      muted
                      loop
                      playsInline
                      preload="none"
                      loading="lazy"
                    />
                    <div className="bp-hall-video-overlay" />
                    <div className="bp-hall-video-label">Live Tour</div>
                    <button
                      className={`bp-video-play-btn ${playingVideo === 'hall-c' ? 'paused' : ''}`}
                      onClick={() => handleVideoToggle('hall-c')}
                      aria-label={playingVideo === 'hall-c' ? 'Pause video' : 'Play video'}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        {playingVideo === 'hall-c' ? (
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                        ) : (
                          <path d="M8 5v14l11-7z"/>
                        )}
                      </svg>
                    </button>
                  </>
                ) : (
                  <div className="bp-hall-video-placeholder">
                    <span>🌟</span>
                    <p>Pearl Hall Video</p>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PACKAGES ── */}
      <section className="bp-packages-sec">
        <div className="bp-inner">
          <Reveal>
            <span style={{fontSize:'11px', letterSpacing:'0.4em', textTransform:'uppercase', color:'#C8102E', display:'block', textAlign:'center', marginBottom:'16px'}}>Pricing</span>
            <h2 style={{fontFamily:'Playfair Display', fontSize:'clamp(36px, 5vw, 56px)', fontWeight:700, textAlign:'center', color:'#2A1000', marginBottom:'12px'}}>Event <em style={{fontStyle:'italic', fontWeight:400, color:'#C8102E'}}>Packages</em></h2>
            <p style={{textAlign:'center', color:'#8C6A3A', fontSize:'15px', marginBottom:'32px'}}>Choose the perfect package for your celebration</p>
          </Reveal>

          {/* Hall Filter Tabs */}
          <div className="bp-hall-tabs">
            <button
              className={`bp-hall-tab ${selectedHallFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              All Halls
            </button>
            <button
              className={`bp-hall-tab ${selectedHallFilter === 'hall-ab' ? 'active' : ''}`}
              onClick={() => handleFilterChange('hall-ab')}
            >
              Hall A & B
              <span className="bp-tab-badge">Min 100 Guests</span>
            </button>
            <button
              className={`bp-hall-tab ${selectedHallFilter === 'hall-c' ? 'active' : ''}`}
              onClick={() => handleFilterChange('hall-c')}
            >
              Hall C
              <span className="bp-tab-badge">Min 50 Guests</span>
            </button>
          </div>

          {/* Filtered Packages */}
          {selectedHallFilter === 'all' && (
            <>
              <div className="bp-packages-grid food-packages">
                {packages.slice(0, visiblePackages).map((pkg, i) => (
                  <Reveal key={pkg.id} delay={i * 80}>
                    <div className={`bp-food-card ${pkg.popular ? 'popular' : ''}`}>
                      {pkg.popular && <div className="bp-package-badge">Popular</div>}
                      <div className="bp-food-pkg-number">Package {String(i + 1).padStart(2, '0')}</div>
                      <div className="bp-food-pkg-name">{pkg.halls?.includes('Hall C') ? 'Hall C' : 'Hall A & B'} Package</div>
                      <div className={`bp-hall-prices-row ${pkg.halls?.includes('Hall C') ? 'single' : ''}`}>
                        {pkg.halls?.includes('Hall A') && (
                          <>
                            <div className="bp-price-pill">
                              <span className="bp-pill-label">Hall A</span>
                              <span className="bp-pill-price">Rs. {pkg.prices['Hall A']}/person</span>
                            </div>
                            <div className="bp-price-pill">
                              <span className="bp-pill-label">Hall B</span>
                              <span className="bp-pill-price">Rs. {pkg.prices['Hall B']}/person</span>
                            </div>
                          </>
                        )}
                        {pkg.halls?.includes('Hall C') && (
                          <div className="bp-price-pill large">
                            <span className="bp-pill-label">Hall C</span>
                            <span className="bp-pill-price">Rs. {pkg.prices['Hall C']}/person</span>
                          </div>
                        )}
                      </div>
                      <ul className="bp-food-items">
                        {pkg.items?.slice(0, 8).map((item, idx) => (
                          <li key={idx}><span className="bp-item-check">✓</span>{item}</li>
                        ))}
                        {pkg.items?.length > 8 && <li className="bp-more-items">+{pkg.items.length - 8} more items</li>}
                      </ul>
                      <button className="bp-package-btn" onClick={() => {
                        document.getElementById('booking-form').scrollIntoView({ behavior: 'smooth' });
                      }}>Book This Package</button>
                    </div>
                  </Reveal>
                ))}
              </div>
              {visiblePackages < packages.length && (
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                  <button className="bp-show-more-btn" onClick={handleShowMore}>
                    Show More Packages ({packages.length - visiblePackages} remaining)
                  </button>
                </div>
              )}
            </>
          )}

          {selectedHallFilter === 'hall-ab' && (
            <>
              <div className="bp-packages-grid food-packages">
                {packages.filter(p => p.halls?.includes('Hall A')).slice(0, visiblePackages).map((pkg, i) => (
                  <Reveal key={pkg.id} delay={i * 100}>
                    <div className={`bp-food-card ${pkg.popular ? 'popular' : ''}`}>
                      {pkg.popular && <div className="bp-package-badge">Popular</div>}
                      <div className="bp-food-pkg-name">{pkg.name}</div>
                      <div className="bp-hall-prices-row">
                        <div className="bp-price-pill">
                          <span className="bp-pill-label">Hall A</span>
                          <span className="bp-pill-price">Rs. {pkg.prices['Hall A']}/person</span>
                        </div>
                        <div className="bp-price-pill">
                          <span className="bp-pill-label">Hall B</span>
                          <span className="bp-pill-price">Rs. {pkg.prices['Hall B']}/person</span>
                        </div>
                      </div>
                      <ul className="bp-food-items">
                        {pkg.items?.slice(0, 8).map((item, idx) => (
                          <li key={idx}><span className="bp-item-check">✓</span>{item}</li>
                        ))}
                        {pkg.items?.length > 8 && <li className="bp-more-items">+{pkg.items.length - 8} more items</li>}
                      </ul>
                      <button className="bp-package-btn" onClick={() => {
                        document.getElementById('booking-form').scrollIntoView({ behavior: 'smooth' });
                      }}>Book This Package</button>
                    </div>
                  </Reveal>
                ))}
              </div>
              {visiblePackages < packages.filter(p => p.halls?.includes('Hall A')).length && (
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                  <button className="bp-show-more-btn" onClick={handleShowMore}>
                    Show More Packages ({packages.filter(p => p.halls?.includes('Hall A')).length - visiblePackages} remaining)
                  </button>
                </div>
              )}
            </>
          )}

          {selectedHallFilter === 'hall-c' && (
            <>
              <div className="bp-packages-grid food-packages hall-c">
                {packages.filter(p => p.halls?.includes('Hall C')).slice(0, visiblePackages).map((pkg, i) => (
                  <Reveal key={pkg.id} delay={i * 100}>
                    <div className={`bp-food-card ${pkg.popular ? 'popular' : ''}`}>
                      {pkg.popular && <div className="bp-package-badge">Popular</div>}
                      <div className="bp-food-pkg-name">{pkg.name}</div>
                      <div className="bp-hall-prices-row single">
                        <div className="bp-price-pill large">
                          <span className="bp-pill-label">Hall C</span>
                          <span className="bp-pill-price">Rs. {pkg.prices['Hall C']}/person</span>
                        </div>
                      </div>
                      <ul className="bp-food-items">
                        {pkg.items?.slice(0, 8).map((item, idx) => (
                          <li key={idx}><span className="bp-item-check">✓</span>{item}</li>
                        ))}
                        {pkg.items?.length > 8 && <li className="bp-more-items">+{pkg.items.length - 8} more items</li>}
                      </ul>
                      <button className="bp-package-btn" onClick={() => {
                        document.getElementById('booking-form').scrollIntoView({ behavior: 'smooth' });
                      }}>Book This Package</button>
                    </div>
                  </Reveal>
                ))}
              </div>
              {visiblePackages < packages.filter(p => p.halls?.includes('Hall C')).length && (
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                  <button className="bp-show-more-btn" onClick={handleShowMore}>
                    Show More Packages ({packages.filter(p => p.halls?.includes('Hall C')).length - visiblePackages} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── BOOKING FORM ── */}
      <section id="booking-form" className="bp-form-sec">
        <div className="bp-inner">
          <Reveal>
            <span className="bp-sec-label">Reserve</span>
            <h2 className="bp-sec-title">Book Your <em>Event</em></h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="bp-form-container">
              <form onSubmit={handleSubmit}>
                <div className="bp-form-group">
                  <label className="bp-form-label">Event Type *</label>
                  <div className="bp-event-grid">
                    {eventTypes.map(type => (
                      <button
                        key={type.id}
                        type="button"
                        className={`bp-event-btn ${selectedEvent === type.id ? 'selected' : ''}`}
                        onClick={() => setSelectedEvent(type.id)}
                      >
                        <span>{type.icon}</span> {type.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bp-form-group">
                  <label className="bp-form-label">Select Hall *</label>
                  <div className="bp-event-grid">
                    {halls.map(hall => (
                      <button
                        key={hall.id}
                        type="button"
                        className={`bp-event-btn ${selectedHall === hall.id ? 'selected' : ''}`}
                        onClick={() => setSelectedHall(hall.id)}
                      >
                        <span>{hall.icon}</span> {hall.name} ({hall.capacity})
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bp-form-grid">
                  <div className="bp-form-group">
                    <label className="bp-form-label">Guests *</label>
                    <input 
                      type="number" 
                      className="bp-form-input"
                      value={guests} 
                      onChange={e => setGuests(e.target.value)} 
                      required 
                      min="50" 
                      max="500" 
                      placeholder="50-500"
                    />
                  </div>
                  <div className="bp-form-group">
                    <label className="bp-form-label">Date *</label>
                    <input 
                      type="date" 
                      className="bp-form-input"
                      value={date} 
                      onChange={e => setDate(e.target.value)} 
                      required 
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="bp-form-group">
                    <label className="bp-form-label">Duration *</label>
                    <select 
                      className="bp-form-select"
                      value={duration} 
                      onChange={e => setDuration(e.target.value)} 
                      required
                    >
                      <option value="">Select</option>
                      <option value="4 hours">4 hours</option>
                      <option value="6 hours">6 hours</option>
                      <option value="8 hours">8 hours</option>
                      <option value="12 hours">12 hours</option>
                      <option value="Full Day">Full Day</option>
                    </select>
                  </div>
                </div>
                <div className="bp-form-group">
                  <label className="bp-form-label">Special Requirements</label>
                  <textarea 
                    className="bp-form-textarea"
                    value={requests} 
                    onChange={e => setRequests(e.target.value)} 
                    rows="4" 
                    placeholder="Tell us about any special requirements..."
                  />
                </div>
                <button type="submit" className="bp-submit-btn">
                  Send Booking Request →
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="bp-contact-sec">
        <div className="bp-inner">
          <Reveal>
            <h3 className="bp-contact-title">Prefer to Call?</h3>
            <p style={{color:'rgba(255,255,255,0.5)', marginBottom:'12px'}}>Our events team at Nagan Head Office is available to assist you</p>
            <p className="bp-contact-phone">📞 0336-3667859</p>
          </Reveal>
        </div>
      </section>
    </div>
    </>
  );
}
