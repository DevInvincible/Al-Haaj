import { useState, useEffect, useRef } from "react";

const LOGO = "/main%20logo.png";
const LOGO_NAME = "/main%20in%20name%20.png";
const FIFTY_IMG = "/50%20years%20png.png";
const BALLROOM_IMG = "/banquet.png";
const RESTAURANT_IMG = "/building.jpeg";
const CATERING_IMG = "/catering/pakwan.jpg";

/* ══════════════════════════════════════════════════════
   FLORAL SVG — dark brown background with cream pattern
══════════════════════════════════════════════════════ */
const FLORAL_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='60' viewBox='0 0 80 60'%3E%3Crect width='80' height='60' fill='%232A1505'/%3E%3Cg fill='none' stroke='%23E8DCC0' stroke-width='0.8' opacity='0.85'%3E%3Cg%3E%3Ccircle cx='40' cy='30' r='10'/%3E%3Ccircle cx='40' cy='30' r='6'/%3E%3Ccircle cx='40' cy='30' r='2'/%3E%3Ccircle cx='28' cy='22' r='5'/%3E%3Ccircle cx='52' cy='22' r='5'/%3E%3Ccircle cx='28' cy='38' r='5'/%3E%3Ccircle cx='52' cy='38' r='5'/%3E%3Ccircle cx='40' cy='14' r='5'/%3E%3Ccircle cx='40' cy='46' r='5'/%3E%3Cpath d='M40 20 L40 24 M40 36 L40 40 M32 30 L36 30 M44 30 L48 30'/%3E%3C/g%3E%3Ccircle cx='8' cy='8' r='2'/%3E%3Ccircle cx='72' cy='8' r='2'/%3E%3Ccircle cx='8' cy='52' r='2'/%3E%3Ccircle cx='72' cy='52' r='2'/%3E%3Ccircle cx='0' cy='30' r='2'/%3E%3Ccircle cx='80' cy='30' r='2'/%3E%3C/g%3E%3C/svg%3E")`;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,900;1,400;1,500;1,600;1,700&family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; overflow-x: hidden; }
  body { overflow-x: hidden; }
  body, #root {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    font-weight: 400;
    overflow-x: hidden;
    background: #F5D6B4;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* ── KEYFRAMES ── */
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(30px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity:0; }
    to   { opacity:1; }
  }
  @keyframes scaleIn {
    from { opacity:0; transform:scale(0.95); }
    to   { opacity:1; transform:scale(1); }
  }
  @keyframes scrollPulse {
    0%,100% { opacity:0.4; transform:translateY(-8px); }
    50%     { opacity:1; transform:translateY(8px); }
  }
  @keyframes floatBadge {
    0%,100% { transform: translateY(0px) rotate(-1deg); }
    50%     { transform: translateY(-10px) rotate(-1deg); }
  }
  @keyframes waveFlow {
    0%   { background-position: 0 0; }
    100% { background-position: 100px 0; }
  }
  @keyframes pulseGlow {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50%     { opacity: 0.6; transform: scale(1.15); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .anim-1 { animation: fadeUp 0.8s 0.1s cubic-bezier(0.22, 1, 0.36, 1) both; }
  .anim-2 { animation: fadeUp 0.8s 0.25s cubic-bezier(0.22, 1, 0.36, 1) both; }
  .anim-3 { animation: fadeUp 0.8s 0.4s cubic-bezier(0.22, 1, 0.36, 1) both; }
  .anim-4 { animation: fadeUp 0.8s 0.55s cubic-bezier(0.22, 1, 0.36, 1) both; }

  .reveal {
    opacity:0; transform:translateY(24px);
    transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .reveal.visible { opacity:1; transform:translateY(0); }

  /* ══════════════════════════════════════════
     NAVBAR — Enhanced Glassmorphism
  ══════════════════════════════════════════ */
  .nav {
    position:fixed; top:0; left:0; right:0; z-index:999;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px) saturate(140%);
    -webkit-backdrop-filter: blur(12px) saturate(140%);
    border-bottom: 1px solid rgba(200, 16, 46, 0.08);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
  }
  .nav-inner {
    height: 80px;
    display:flex; align-items:center; justify-content:space-between;
    padding:0 48px;
    max-width:1400px; margin:0 auto;
    gap: 32px;
  }
  .nav-logo {
    display:flex; align-items:baseline; gap:0;
    text-decoration:none; flex-shrink:0;
    transition: transform 0.3s ease;
  }
  .nav-logo:hover { transform: scale(1.02); }
  .nav-brand-wrap {
    display: flex;
    flex-direction: column;
  }
  .nav-brand-main {
    font-family:'Playfair Display', serif;
    font-size: clamp(20px, 2.5vw, 26px); 
    font-weight:700;
    color:#1a1a1a; 
    letter-spacing:0.02em;
    line-height:1.1;
    white-space: nowrap;
  }
  .nav-brand-main span { 
    color:#C8102E; 
    font-weight: 600;
  }
  .nav-brand-sub {
    font-family:'Inter', sans-serif;
    font-size: clamp(8px, 1vw, 10px); 
    letter-spacing:0.2em;
    color:rgba(26,26,26,0.6); 
    font-weight:500;
    text-transform:uppercase;
    margin-top:4px;
  }
  .nav-links {
    display:flex; align-items:center; gap: clamp(24px, 3vw, 40px); 
    flex:1; justify-content:center;
  }
  .nav-link {
    font-family:'Inter', sans-serif;
    font-size: clamp(13px, 1.2vw, 15px); 
    letter-spacing:0.05em;
    color:#2a2a2a; 
    text-decoration:none; 
    font-weight:500;
    transition: all 0.3s ease; 
    position:relative; 
    padding:8px 4px;
    white-space: nowrap;
  }
  .nav-link::after {
    content:''; 
    position:absolute; 
    bottom: 2px; 
    left:0; 
    right:0; 
    height:2px;
    background: linear-gradient(90deg, transparent, #C8102E, transparent);
    transform:scaleX(0); 
    transition:transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    border-radius: 2px;
  }
  .nav-link:hover { color:#C8102E; }
  .nav-link:hover::after { transform:scaleX(1); }
  .nav-cta {
    background: linear-gradient(135deg, #C8102E 0%, #a00d25 100%);
    color:#fff; 
    padding: 12px 28px; 
    text-decoration:none;
    font-family:'Inter', sans-serif;
    font-size: clamp(10px, 1vw, 12px); 
    letter-spacing:0.15em; 
    text-transform:uppercase; 
    font-weight:600;
    transition:all 0.3s cubic-bezier(0.22, 1, 0.36, 1); 
    border:none; 
    border-radius: 4px;
    box-shadow: 0 4px 20px rgba(200,16,46,0.25);
    white-space: nowrap; 
    flex-shrink:0;
  }
  .nav-cta:hover {
    background: linear-gradient(135deg, #0033A0 0%, #001f6e 100%);
    box-shadow: 0 6px 25px rgba(0,51,160,0.35);
    transform: translateY(-2px);
  }

  /* Hamburger — Enhanced */
  .nav-hamburger {
    display:none; 
    flex-direction:column; 
    justify-content:center; 
    gap: 6px;
    cursor:pointer; 
    background:none; 
    border:none; 
    padding: 8px; 
    z-index:1001;
    width: 44px;
    height: 44px;
    align-items: center;
  }
  .nav-hamburger span {
    display:block; 
    width: 24px; 
    height: 2px;
    background:#1a1a1a; 
    border-radius: 2px;
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    transform-origin: center;
  }
  .nav-hamburger.open span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
  .nav-hamburger.open span:nth-child(2) { opacity:0; transform:scaleX(0); }
  .nav-hamburger.open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

  /* Mobile menu drawer — Enhanced */
  .nav-mobile-menu {
    display:none; 
    position:fixed; 
    top: 80px; 
    left:0; 
    right:0; 
    bottom:0;
    background: rgba(15, 15, 15, 0.98); 
    backdrop-filter: blur(16px);
    flex-direction:column; 
    align-items:center; 
    justify-content: flex-start;
    padding-top: 60px;
    gap: 32px; 
    z-index:998;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  .nav-mobile-menu.open { 
    display:flex; 
    opacity: 1;
    pointer-events: all;
  }
  .nav-mobile-link {
    font-family:'Playfair Display', serif;
    font-size: clamp(28px, 6vw, 36px); 
    color:#fff; 
    text-decoration:none;
    font-weight:500; 
    letter-spacing:0.02em; 
    font-style: italic;
    transition: all 0.3s ease;
    opacity: 0.9;
  }
  .nav-mobile-link:hover { 
    color:#C8102E; 
    opacity: 1;
    transform: translateX(10px);
  }
  .nav-mobile-cta {
    background: linear-gradient(135deg,#C8102E,#a00d25);
    color:#fff; 
    padding: 16px 40px;
    font-size: 12px; 
    letter-spacing:0.2em; 
    text-transform:uppercase; 
    font-weight:600;
    text-decoration:none; 
    border-radius: 4px; 
    margin-top: 16px;
    font-family:'Inter', sans-serif;
    box-shadow: 0 4px 20px rgba(200,16,46,0.3);
  }

  /* Hide scrollbar for Chrome, Safari and Opera */
  .hero::-webkit-scrollbar,
  .hero *::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    background: transparent !important;
  }

  /* ══════════════════════════════════════════
     HERO
  ══════════════════════════════════════════ */
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    overflow: hidden !important;
    margin-top: 80px;
    background: #080808;
    max-width: 100%;
    width: 100%;
    -ms-overflow-style: none !important;
    scrollbar-width: none !important;
    scrollbar-color: transparent transparent !important;
  }
  .hero * {
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
  }

  /* Background base radial */
  .hero-base {
    position: absolute; inset: 0; z-index: 0;
    background:
      radial-gradient(ellipse 60% 70% at 15% 50%, rgba(200,16,46,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 50% 60% at 85% 80%, rgba(0,51,160,0.05) 0%, transparent 60%);
  }

  /* Red glow top-left */
  .hero-glow-red {
    position: absolute;
    top: -120px; left: -80px;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(200,16,46,0.13) 0%, transparent 70%);
    filter: blur(30px);
    z-index: 1; pointer-events: none;
    will-change: transform, opacity;
    animation: pulseGlow 8s ease-in-out infinite;
  }

  /* Blue glow bottom */
  .hero-glow-blue {
    position: absolute;
    bottom: -100px; right: 30%;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,51,160,0.08) 0%, transparent 70%);
    filter: blur(25px);
    z-index: 1; pointer-events: none;
    will-change: transform, opacity;
    animation: pulseGlow 10s ease-in-out infinite 2s;
  }

  /* Thin red line at very top */
  .hero-topline {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, #C8102E 0%, rgba(200,16,46,0.3) 50%, transparent 80%);
    z-index: 10;
  }

  /* Subtle grid pattern */
  .hero-pattern {
    position: absolute; inset: 0; z-index: 1; pointer-events: none;
    background-image:
      linear-gradient(rgba(200,16,46,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(200,16,46,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  /* Building image — right side bleed */
  .hero-building-img {
    position: absolute;
    right: 0; top: 0;
    width: 58%;
    max-width: 58%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    opacity: 0.5;
    z-index: 2;
    pointer-events: none;
    filter: saturate(0.65) brightness(0.7);
    will-change: transform;
    overflow: hidden;
  }

  /* Left-to-right dark fade over building */
  .hero-overlay {
    position: absolute; inset: 0; z-index: 3; pointer-events: none;
    background: linear-gradient(
      to right,
      #080808 0%,
      #080808 25%,
      rgba(8,8,8,0.97) 33%,
      rgba(8,8,8,0.85) 44%,
      rgba(8,8,8,0.5) 58%,
      rgba(8,8,8,0.15) 76%,
      rgba(8,8,8,0.35) 100%
    );
  }

  /* Top + bottom vignette */
  .hero-vignette {
    position: absolute; inset: 0; z-index: 4; pointer-events: none;
    background: linear-gradient(
      to bottom,
      #080808 0%,
      transparent 10%,
      transparent 82%,
      #080808 100%
    );
  }

  /* ── LAYOUT ── */
  .hero-layout {
    position: relative;
    z-index: 6;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    padding: 0 6%;
    gap: 30px;
  }

  /* ── CONTENT ── */
  .hero-content {
    position: relative;
    z-index: 6;
    max-width: 580px;
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-top: 20px;
    overflow-x: hidden;
    word-wrap: break-word;
  }

  /* Badge */
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: rgba(200,16,46,0.1);
    border: 1px solid rgba(200,16,46,0.22);
    padding: 14px 26px;
    border-radius: 50px;
    font-size: 13px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #e87a8a;
    font-weight: 600;
    width: fit-content;
    margin-bottom: 24px;
  }
  .hero-badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #C8102E;
    animation: pulse-ring 2s infinite;
  }

  /* ── BOTH LOGOS ROW ── */
  .hero-logos-row {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 20px;
    max-width: 100%;
    flex-wrap: wrap;
  }

  /* Circle logo */
  .hero-logo-circle-wrap {
    width: 140px; height: 140px;
    border-radius: 50%;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
    box-shadow:
      0 8px 32px rgba(0,0,0,0.6),
      0 0 0 1px rgba(200,16,46,0.12),
      inset 0 1px 0 rgba(255,255,255,0.05);
  }
  .hero-logo-circle-img {
    width: 100%; height: 100%;
    object-fit: contain;
    padding: 8px;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5));
  }

  /* Vertical separator */
  .hero-logo-divider-v {
    width: 1px;
    height: 100px;
    background: linear-gradient(to bottom, transparent, rgba(200,16,46,0.4), transparent);
    flex-shrink: 0;
  }

  /* Name logo */
  .hero-logo-name-wrap {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-width: 100%;
    align-items: flex-start;
  }
  .hero-logo-name-img {
    height: clamp(70px, 9vw, 110px);
    width: auto;
    filter: drop-shadow(0 6px 20px rgba(0,0,0,0.7));
  }
  .hero-est-tag {
    font-size: 10px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.28);
    font-weight: 500;
    font-family: 'Inter', sans-serif;
  }

  /* ── ORNAMENT DIVIDER ── */
  .hero-ornament {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  .hero-orn-line {
    width: 70px; height: 1px;
    background: linear-gradient(90deg, #C8102E, transparent);
  }
  .hero-orn-line-fade {
    background: linear-gradient(90deg, rgba(255,255,255,0.1), transparent);
    width: 40px;
  }
  .hero-orn-diamond {
    width: 6px; height: 6px;
    background: #C8102E;
    transform: rotate(45deg);
    box-shadow: 0 0 8px rgba(200,16,46,0.6);
  }
  .hero-orn-dot {
    width: 3px; height: 3px;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
  }

  /* Description */
  .hero-desc {
    font-size: clamp(14px, 1.6vw, 16px);
    color: rgba(255,255,255,0.55);
    line-height: 1.8;
    max-width: 460px;
    margin-bottom: 28px;
    font-weight: 300;
    font-family: 'Inter', sans-serif;
  }
  .hero-desc strong {
    color: rgba(255,255,255,0.85);
    font-weight: 500;
  }

  /* Buttons */
  .hero-btns {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    margin-top: 8px;
  }
  .btn-red {
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #C8102E 0%, #8B0A1A 100%);
    color: #fff;
    border: none;
    padding: 16px 32px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    font-weight: 600;
    text-decoration: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    display: inline-flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 20px rgba(200,16,46,0.3);
  }
  .btn-red span {
    font-size: 14px;
    transition: transform 0.3s ease;
  }
  .btn-red:hover span {
    transform: translateX(4px);
  }
  .btn-red::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }
  .btn-red:hover::before {
    left: 100%;
  }
  .btn-red:hover {
    background: linear-gradient(135deg,#0033A0,#001f6e);
    box-shadow: 0 10px 40px rgba(0,51,160,0.4);
    transform: translateY(-3px);
  }
  .btn-outline-cream {
    background: transparent;
    border: 2px solid rgba(255,255,255,0.3);
    color: rgba(255,255,255,0.9);
    padding: 16px 34px;
    font-family: 'Inter', sans-serif;
    font-size: clamp(11px, 1.2vw, 13px);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border-radius: 4px;
    backdrop-filter: blur(10px);
  }
  .btn-outline-cream:hover {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.6);
    color: #fff;
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  }

  /* ── STATS ── */
  .hero-stats {
    position: relative;
    z-index: 6;
    display: flex;
    align-items: center;
    gap: 28px;
    background: rgba(8,8,8,0.5);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    padding: 16px 28px;
    margin-bottom: 20px;
  }
  .hero-stat { text-align: center; flex-shrink: 0; }
  .hero-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: clamp(24px, 3vw, 32px);
    font-weight: 700;
    color: #fff;
    line-height: 1;
  }
  .hero-stat-lbl {
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    font-weight: 500;
    margin-top: 5px;
    font-family: 'Inter', sans-serif;
  }
  .hero-stat-sep {
    width: 1px;
    height: 36px;
    background: rgba(255,255,255,0.1);
  }

  /* Scroll cue */
  .scroll-cue {
    position: absolute;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    font-size: 10px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: rgba(251,232,203,0.6);
    z-index: 6;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
  }
  .scroll-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(251,232,203,0.8);
    animation: scrollPulse 2s ease-in-out infinite;
    box-shadow: 0 0 20px rgba(251,232,203,0.3);
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 1024px) {
    .hero-building-img { width: 65%; opacity: 0.4; }
    .hero-content { max-width: 100%; }
  }
  @media (max-width: 768px) {
    /* Disable heavy animations on mobile for better performance */
    .hero-glow-red, .hero-glow-blue { 
      display: none; 
    }
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.2s !important;
    }
    .nav {
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }
    .svc-card:hover, .loc-card:hover, .stat-card:hover {
      transform: none;
    }
    .hero { margin-top: 70px; min-height: auto; padding: 40px 0 60px; }
    .hero-building-img {
      width: 100%; height: 100%;
      max-width: 100%;
      left: 0; right: 0; top: 0; bottom: 0;
      opacity: 0.6;
      mask-image: linear-gradient(to top, rgba(0,0,0,0.8) 60%, transparent 100%);
      -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,0.8) 60%, transparent 100%);
    }
    .hero-overlay {
      background: linear-gradient(to bottom,
        transparent 0%,
        rgba(8,8,8,0.3) 30%,
        rgba(8,8,8,0.6) 60%,
        rgba(8,8,8,0.85) 100%);
    }
    .hero-layout {
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 0 20px;
      gap: 30px;
    }
    .hero-content {
      padding: 0;
      align-items: center;
      text-align: center;
      max-width: 100%;
      margin-top: 0;
    }
    .hero-badge { margin-bottom: 24px; padding: 10px 20px; font-size: 11px; }
    .hero-logos-row { flex-direction: column; gap: 20px; align-items: center; margin-bottom: 24px; }
    .hero-logo-circle-wrap { width: 130px; height: 130px; }
    .hero-logo-divider-v { width: 80px; height: 1px;
      background: linear-gradient(to right, transparent, rgba(200,16,46,0.4), transparent);
    }
    .hero-logo-name-wrap { align-items: center; gap: 8px; }
    .hero-logo-name-img { height: 85px; }
    .hero-est-tag { font-size: 10px; }
    .hero-ornament { justify-content: center; margin-bottom: 20px; }
    .hero-orn-line { width: 60px; }
    .hero-desc { text-align: center; font-size: 15px; margin-bottom: 24px; }
    .hero-btns { flex-direction: column; align-items: center; width: 100%; gap: 14px; }
    .hero-btns a { width: 100%; max-width: 280px; justify-content: center; padding: 16px 28px; font-size: 12px; }
    .hero-stats {
      position: relative;
      bottom: auto;
      left: auto;
      transform: none;
      margin: 0 auto 20px;
      padding: 18px 28px;
      gap: 24px;
      width: auto;
      max-width: none;
      flex-direction: row;
      align-items: center;
    }
    .hero-stat {
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }
    .hero-stat-num { font-size: 22px; text-align: center; }
    .hero-stat-lbl { font-size: 11px; letter-spacing: 0.08em; white-space: nowrap; text-align: center; }
    .hero-stat-sep { height: 30px; }
    .scroll-cue { display: none; }
  }
  @media (max-width: 480px) {
    .hero { padding: 30px 0 40px; }
    .hero-logo-circle-wrap { width: 115px; height: 115px; }
    .hero-logo-name-img { height: 75px; }
    .hero-layout { gap: 25px; }
    .hero-stats {
      margin: 0 auto 10px;
      padding: 16px 24px;
      gap: 20px;
    }
    .hero-stat { gap: 4px; }
    .hero-stat-num { font-size: 20px; }
    .hero-stat-lbl { font-size: 10px; letter-spacing: 0.06em; }
    .hero-stat-sep { height: 26px; }
    .hero-badge { font-size: 10px; letter-spacing: 0.2em; padding: 9px 18px; }
    .hero-desc { font-size: 14px; line-height: 1.7; }
    .hero-btns a { padding: 14px 24px; font-size: 12px; max-width: 260px; }
    .scroll-cue { display: none; }
  }
  @media (max-width: 360px) {
    .hero-logo-circle-wrap { width: 100px; height: 100px; }
    .hero-logo-name-img { height: 65px; }
    .hero-layout { gap: 20px; }
    .hero-stats {
      margin: 0 auto 10px;
      padding: 14px 20px;
      gap: 16px;
    }
    .hero-stat { gap: 3px; }
    .hero-stat-num { font-size: 18px; }
    .hero-stat-lbl { font-size: 9px; letter-spacing: 0.05em; }
    .hero-stat-sep { height: 22px; }
    .hero-badge { font-size: 9px; padding: 8px 16px; }
    .hero-desc { font-size: 13px; }
    .hero-btns a { padding: 12px 20px; font-size: 11px; }
    .scroll-cue { display: none; }
  }

  /* ══════════════════════════════════════════
     FLORAL BAND
  ══════════════════════════════════════════ */
  .floral-band { width:100%; }
  .floral-body {
    height: 80px;
    background-color: #2A1505;
    background-image: ${FLORAL_SVG};
    background-repeat: repeat-x;
    background-size: 80px 60px;
    background-position: center;
    animation: waveFlow 15s linear infinite;
    position: relative;
  }
  .floral-body::before {
    content:''; 
    position:absolute; 
    top:0; 
    left:0; 
    right:0; 
    height: 30px;
    background: linear-gradient(to bottom,rgba(0,0,0,0.6),transparent);
    pointer-events:none; 
    z-index:1;
  }
  .floral-body::after {
    content:''; 
    position:absolute; 
    bottom:0; 
    left:0; 
    right:0; 
    height: 30px;
    background: linear-gradient(to top,rgba(0,0,0,0.6),transparent);
    pointer-events:none; 
    z-index:1;
  }

  /* ══════════════════════════════════════════
     SHARED SECTION HELPERS
  ══════════════════════════════════════════ */
  .sec-inner { 
    max-width: 1280px; 
    margin:0 auto; 
    padding: 100px 48px; 
  }
  .sec-label {
    font-family: 'Inter', sans-serif;
    font-size: 11px; 
    letter-spacing:0.4em; 
    text-transform:uppercase;
    font-weight:600; 
    margin-bottom: 16px; 
    display:block;
  }
  .sec-title {
    font-family:'Playfair Display', serif;
    font-size: clamp(36px, 5vw, 56px);
    font-weight:700; 
    line-height:1.15;
    letter-spacing: -0.02em;
  }
  .sec-title em { 
    font-style:italic; 
    font-weight:400; 
    color: #C8102E;
  }
  .section-header-line {
    width: 80px; 
    height: 3px; 
    margin-top: 24px;
    background: linear-gradient(90deg,#C8102E,#0033A0);
    border-radius: 3px;
  }

  /* ══════════════════════════════════════════  LEGACY ══ */
  .legacy-sec { background:#FBE8CB; }
  .legacy-sec .sec-label { color:#C8102E; }
  .legacy-sec .sec-title { color:#2A1000; }
  .legacy-grid {
    display:grid; 
    grid-template-columns:1fr 1fr;
    gap: 80px; 
    align-items:center;
  }
  .legacy-text p { 
    font-family: 'Inter', sans-serif;
    color:#4a2e18; 
    line-height:1.9; 
    margin-top: 24px; 
    font-size: clamp(15px, 1.5vw, 17px);
    font-weight: 400;
  }
  .stats-row {
    display:grid; 
    grid-template-columns:repeat(3,1fr);
    gap: 16px; 
    margin-top: 48px;
  }
  .stat-card {
    padding: 32px 20px; 
    text-align:center;
    background:#fff; 
    border:1px solid rgba(200,16,46,0.1);
    border-top: 4px solid #C8102E;
    border-radius: 8px;
    transition:all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    will-change: transform;
  }
  .stat-card:hover { 
    box-shadow:0 12px 40px rgba(200,16,46,0.15); 
    transform:translateY(-5px); 
  }
  .stat-num { 
    font-family:'Playfair Display', serif; 
    font-size: clamp(36px, 4vw, 48px); 
    font-weight:700; 
    color:#C8102E; 
    line-height:1; 
  }
  .stat-lbl { 
    font-family: 'Inter', sans-serif;
    font-size: 11px; 
    letter-spacing:0.15em; 
    text-transform:uppercase; 
    color:#7a5030; 
    margin-top: 12px;
    font-weight: 500;
  }
  .badge-img {
    width:min(320px,90%); 
    display:block; 
    margin:0 auto;
    filter:drop-shadow(0 20px 60px rgba(200,16,46,0.25));
    animation: floatBadge 5s ease-in-out infinite;
  }

  /* ══════════════════════════════════════════
     SERVICES — Enhanced Cards
  ══════════════════════════════════════════ */
  .services-sec {
    background: #0a0a0a;
    border-top: none;
  }
  .services-sec .sec-label { color: rgba(200,16,46,0.9); }
  .services-sec .sec-title { color: #fff; }
  .services-sec .sec-title em { color: rgba(251,232,203,0.9); }
  .services-sec .section-header-line { 
    background: linear-gradient(90deg,#C8102E,rgba(255,255,255,0.2)); 
  }

  .svc-track-wrap {
    margin-top: 60px;
    overflow-x: auto;
    overflow-y: visible;
    cursor: grab;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .svc-track-wrap::-webkit-scrollbar { display: none; }
  .svc-track-wrap:active { cursor: grabbing; }

  /* Section number (01, 02, 03 etc) */
  .sec-number {
    font-family: 'Playfair Display', serif;
    font-size: clamp(40px, 8vw, 100px);
    font-weight: 900;
    line-height: 1;
    color: rgba(255,255,255,0.04);
    letter-spacing: -0.04em;
    user-select: none;
    flex-shrink: 0;
  }
  .svc-track {
    display: flex;
    gap: 28px;
    width: max-content;
    padding-bottom: 20px;
    justify-content: center;
    padding-left: 5%;
    padding-right: 5%;
  }

  .svc-card {
    position: relative;
    width: clamp(320px, 28vw, 380px);
    height: 480px;
    border-radius: 20px;
    overflow: hidden;
    flex-shrink: 0;
    cursor: pointer;
    background: linear-gradient(145deg, #1a1a1a, #0f0f0f);
    border: 1px solid rgba(255,255,255,0.08);
    transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  .svc-card:hover { 
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(200,16,46,0.12);
    border-color: rgba(200,16,46,0.25);
  }

  .svc-img {
    position: absolute; 
    inset: 0;
    width: 100%; 
    height: 100%;
    object-fit: cover; 
    object-position: center center;
    transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease;
    display: block;
    opacity: 0.7;
  }
  .svc-card:hover .svc-img { 
    transform: scale(1.05); 
    opacity: 0.9;
  }

  .svc-img-placeholder {
    position: absolute; 
    inset: 0;
    display: flex; 
    align-items: center; 
    justify-content: center;
    font-size: 80px;
    background: linear-gradient(135deg, #1a0a05 0%, #2a1508 50%, #1a0a05 100%);
  }

  .svc-img-overlay {
    position: absolute; 
    inset: 0;
    background: linear-gradient(to bottom,
      rgba(0,0,0,0.1) 0%,
      rgba(0,0,0,0.2) 40%,
      rgba(0,0,0,0.6) 100%);
    z-index: 1;
    transition: all 0.4s ease;
  }
  .svc-card:hover .svc-img-overlay {
    background: linear-gradient(to bottom,
      rgba(0,0,0,0.05) 0%,
      rgba(0,0,0,0.2) 40%,
      rgba(0,0,0,0.7) 100%);
  }

  .svc-badge {
    position: absolute; 
    top: 16px; 
    left: 16px; 
    z-index: 3;
    background: rgba(200,16,46,0.9);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(200,16,46,0.5);
    padding: 6px 14px;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 9px; 
    font-weight: 600;
    letter-spacing: 0.12em; 
    color: #fff;
  }

  .svc-body {
    position: absolute; 
    bottom: 0; 
    left: 0; 
    right: 0;
    padding: 32px 28px;
    z-index: 2;
  }
  .svc-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(24px, 2.5vw, 28px); 
    color: #fff;
    font-weight: 600; 
    line-height: 1.2;
    margin-bottom: 12px;
  }
  .svc-desc {
    font-family: 'Inter', sans-serif;
    font-size: 14px; 
    color: rgba(255,255,255,0.75);
    line-height: 1.7;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-weight: 400;
  }
  .svc-cta {
    display: inline-flex; 
    align-items: center; 
    gap: 8px;
    margin-top: 20px; 
    font-family: 'Inter', sans-serif;
    font-size: 11px; 
    letter-spacing: 0.15em;
    text-transform: uppercase; 
    color: rgba(255,255,255,0.7); 
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
  }
  .svc-card:hover .svc-cta { 
    color: #C8102E; 
    gap: 12px; 
  }
  .svc-cta-arrow { 
    font-size: 14px; 
    transition: transform 0.3s ease;
  }
  .svc-card:hover .svc-cta-arrow {
    transform: translateX(4px);
  }

  .svc-drag-hint {
    margin-top: 24px;
    font-family: 'Inter', sans-serif;
    font-size: 11px; 
    letter-spacing: 0.25em; 
    text-transform: uppercase;
    color: rgba(255,255,255,0.25); 
    text-align: right;
    font-weight: 500;
  }

  /* ══════════════════════════════════════════  LOCATIONS ══ */
  .locations-sec { 
    background:#0a0a0a; 
    border-top: 4px solid #C8102E; 
  }
  .locations-sec .sec-label { color:rgba(200,16,46,0.9); }
  .locations-sec .sec-title { color:#fff; }
  .locations-sec .sec-title em { color:rgba(251,232,203,0.9); }
  .locations-sec .section-header-line { 
    background: linear-gradient(90deg,#C8102E,rgba(255,255,255,0.2)); 
  }
  .loc-grid {
    display:grid; 
    grid-template-columns:repeat(3,1fr);
    gap: 24px; 
    margin-top: 60px;
  }
  .loc-card {
    background: rgba(255,255,255,0.03); 
    border: 1px solid rgba(255,255,255,0.1);
    border-top: 4px solid rgba(251,232,203,0.6); 
    padding: 40px 32px;
    position:relative; 
    overflow:hidden; 
    transition:all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    border-radius: 12px;
    backdrop-filter: blur(10px);
  }
  .loc-card:hover { 
    background: rgba(255,255,255,0.06); 
    transform:translateY(-4px); 
    border-top-color: #C8102E;
    box-shadow: 0 12px 30px rgba(0,0,0,0.25);
  }
  .loc-tag { 
    font-family: 'Inter', sans-serif;
    font-size: 10px; 
    letter-spacing:0.3em; 
    text-transform:uppercase; 
    color:rgba(251,232,203,0.7); 
    margin-bottom: 16px; 
    font-weight: 600;
  }
  .loc-name { 
    font-family:'Playfair Display', serif; 
    font-size: clamp(22px, 2.5vw, 26px); 
    color:#fff; 
    margin-bottom: 12px; 
    font-weight: 600;
  }
  .loc-addr { 
    font-family: 'Inter', sans-serif;
    font-size: 14px; 
    color:rgba(255,255,255,0.7); 
    line-height:1.8; 
    margin-bottom: 28px;
    font-weight: 400;
  }
  .loc-link {
    font-family: 'Inter', sans-serif;
    font-size: 11px; 
    letter-spacing:0.15em; 
    text-transform:uppercase;
    color:#FBE8CB; 
    text-decoration:none; 
    font-weight: 600;
    display:inline-flex; 
    align-items:center; 
    gap: 8px; 
    transition:all 0.3s ease;
  }
  .loc-link:hover { gap: 14px; color: #C8102E; }

  /* ══════════════════════════════════════════  TIMINGS ══ */
  .timings-sec { 
    background:#FBE8CB; 
    border-top: 3px solid #C8102E; 
  }
  .timings-sec .sec-label { color:#C8102E; }
  .timings-sec .sec-title { color:#2A1000; }
  .timings-sec .sec-title em { color:#C8102E; }
  .timings-sec .section-header-line { 
    background: linear-gradient(90deg,#C8102E,#2A1000); 
  }
  .timing-grid { 
    display:grid; 
    grid-template-columns:1fr 1fr; 
    gap: 32px; 
    margin-top: 60px; 
  }
  .timing-block {
    border: 1px solid rgba(200,16,46,0.15); 
    padding: 40px;
    background:#fff; 
    border-top: 5px solid #C8102E;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    transition: transform 0.3s ease;
  }
  .timing-block:hover {
    transform: translateY(-4px);
  }
  .timing-block-title {
    font-family:'Playfair Display', serif; 
    font-size: clamp(20px, 2.5vw, 24px); 
    color:#2A1000;
    margin-bottom: 24px; 
    border-bottom: 2px solid rgba(200,16,46,0.15);
    padding-bottom: 16px; 
    font-weight: 600;
  }
  .timing-row {
    display:flex; 
    justify-content:space-between; 
    align-items:center;
    padding: 14px 0; 
    border-bottom: 1px dashed rgba(42,16,5,0.12);
    font-family: 'Inter', sans-serif;
    font-size: clamp(13px, 1.5vw, 15px);
  }
  .timing-row:last-of-type { border-bottom:none; }
  .timing-label { color:#5a4030; font-weight: 500; }
  .timing-value { color:#2A1000; font-weight: 600; }
  .menu-tag { 
    display:inline-block; 
    padding: 6px 14px; 
    font-family: 'Inter', sans-serif;
    font-size: 10px; 
    letter-spacing:0.15em; 
    text-transform:uppercase; 
    font-weight: 600; 
    border-radius: 4px;
    transition: all 0.3s ease;
  }
  .tag-avail { 
    background: rgba(200,16,46,0.1); 
    color:#C8102E; 
    border: 1px solid rgba(200,16,46,0.3); 
  }
  .tag-unavail { 
    background:#f0ece4; 
    color:#888; 
    border: 1px solid #ddd5bc; 
  }
  .live-time { 
    font-family:'Playfair Display', serif; 
    font-size: clamp(20px, 2.5vw, 24px); 
    color:#C8102E; 
    margin-top: 20px; 
    font-style:italic;
    font-weight: 600;
  }

  /* ══════════════════════════════════════════  FOOTER ══ */
  .footer-bg { 
    background:#0a0a0a; 
    border-top: 5px solid #C8102E; 
    padding: 80px 48px 40px; 
  }
  .footer-inner { max-width:1280px; margin:0 auto; }
  .footer-grid { 
    display:grid; 
    grid-template-columns:2fr 1fr 1fr; 
    gap: 60px; 
    margin-bottom: 60px; 
  }
  .footer-logo-circle {
    width: 72px; 
    height: 72px; 
    border-radius:50%;
    background: linear-gradient(135deg,#C8102E,#8a0d1f);
    display:flex; 
    align-items:center; 
    justify-content:center;
    font-family:'Playfair Display', serif; 
    font-weight:700;
    font-size: 28px; 
    color:#fff; 
    margin-bottom: 20px;
    box-shadow: 0 8px 30px rgba(200,16,46,0.3);
  }
  .footer-brand-name { 
    font-family:'Playfair Display', serif; 
    font-size: clamp(20px, 2.5vw, 24px); 
    color:#FBE8CB; 
    margin-bottom: 12px; 
    font-weight: 600;
  }
  .footer-tagline { 
    font-family: 'Inter', sans-serif;
    font-size: 14px; 
    color:rgba(251,232,203,0.6); 
    line-height:1.8; 
    max-width: 300px;
    font-weight: 400;
  }
  .footer-heading { 
    font-family: 'Inter', sans-serif;
    font-size: 12px; 
    letter-spacing:0.3em; 
    text-transform:uppercase; 
    color:#C8102E; 
    margin-bottom: 24px; 
    font-weight: 700;
  }
  .footer-links { list-style:none; }
  .footer-links li { margin-bottom: 14px; }
  .footer-links a {
    font-family: 'Inter', sans-serif;
    font-size: 14px; 
    color:rgba(251,232,203,0.65); 
    text-decoration:none; 
    transition:all 0.3s ease;
    display:inline-flex; 
    align-items:center; 
    gap: 10px;
    font-weight: 500;
  }
  .footer-links a::before { 
    content:'›'; 
    color:rgba(200,16,46,0.6);
    font-size: 16px;
    transition: all 0.3s ease;
  }
  .footer-links a:hover { 
    color:#FBE8CB; 
    transform: translateX(4px);
  }
  .footer-links a:hover::before {
    color: #C8102E;
  }
  .footer-contact { 
    font-family: 'Inter', sans-serif;
    font-size: 14px; 
    color:rgba(251,232,203,0.65); 
    line-height:2.2;
    font-weight: 400;
  }
  .footer-contact a { 
    color:rgba(251,232,203,0.8); 
    text-decoration:none; 
    transition:all 0.3s ease;
    font-weight: 500;
  }
  .footer-contact a:hover { color:#FBE8CB; }
  .wa-btn {
    display:inline-flex; 
    align-items:center; 
    gap: 10px;
    background: #25D366; 
    color:#fff; 
    padding: 14px 24px; 
    margin-top: 20px;
    font-family: 'Inter', sans-serif;
    font-size: 12px; 
    letter-spacing:0.15em; 
    text-transform:uppercase;
    font-weight: 600; 
    text-decoration:none; 
    transition:all 0.3s ease;
    border-radius: 6px;
    box-shadow: 0 4px 20px rgba(37, 211, 102, 0.3);
  }
  .wa-btn:hover { 
    transform:translateY(-3px); 
    box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4);
  }
  .social-row { 
    display:flex; 
    gap: 12px; 
    margin-top: 24px; 
  }
  .social-ico {
    width: 40px; 
    height: 40px; 
    border: 1px solid rgba(200,16,46,0.3);
    border-radius: 8px;
    display:flex; 
    align-items:center; 
    justify-content:center;
    color:rgba(200,16,46,0.6); 
    text-decoration:none; 
    font-size: 14px;
    font-weight: 600; 
    transition:all 0.3s ease;
  }
  .social-ico:hover { 
    border-color:#C8102E; 
    color:#C8102E; 
    background:rgba(200,16,46,0.1);
    transform: translateY(-3px);
  }
  .footer-bottom {
    border-top:1px solid rgba(200,16,46,0.15); 
    padding-top: 32px;
    display:flex; 
    justify-content:space-between; 
    align-items:center;
    font-family: 'Inter', sans-serif;
    font-size: 12px; 
    color:rgba(251,232,203,0.45);
    flex-wrap:wrap; 
    gap: 16px;
    font-weight: 500;
  }
  .footer-since { 
    font-family:'Playfair Display', serif;
    font-style:italic; 
    color:rgba(200,16,46,0.6); 
    font-size: 14px;
    font-weight: 500;
  }

  /* ══════════════════════════════════════════
     RESPONSIVE — Enhanced Mobile Experience
  ══════════════════════════════════════════ */
  @media (max-width: 1024px) {
    .nav-inner { padding: 0 24px; }
    .legacy-grid { 
      grid-template-columns:1fr; 
      gap: 48px; 
    }
    .timing-grid { grid-template-columns:1fr; }
    .footer-grid { 
      grid-template-columns:1fr 1fr; 
      gap: 40px; 
    }
    .sec-inner { padding: 80px 32px; }
    .svc-track-wrap { 
      width: 100%;
      justify-content: flex-start;
      overflow-x: scroll;
    }
    .svc-track {
      padding-left: 20px;
      padding-right: 20px;
      justify-content: flex-start;
    }
    .svc-card {
      width: clamp(300px, 40vw, 360px);
      height: 440px;
    }
  }

  @media (max-width: 768px) {
    .nav-inner { 
      height: 70px;
      padding: 0 20px; 
    }
    .nav-links { display:none; }
    .nav-cta { display:none; }
    .nav-hamburger { display:flex; }

    .hero-btns { 
      flex-direction: column; 
      align-items: center;
      width: 100%;
      gap: 12px;
    }
    .hero-btns a { 
      width: 100%; 
      max-width: 280px; 
      text-align: center;
      justify-content: center;
    }
    .scroll-cue {
      bottom: 60px;
    }

    .svc-card { 
      width: 85vw; 
      height: 420px; 
    }
    .svc-track-wrap { 
      width: 100%;
      justify-content: flex-start;
    }
    .svc-track {
      padding-left: 16px;
      padding-right: 16px;
      justify-content: flex-start;
    }
    .sec-number { font-size: 60px; }

    .loc-grid { 
      grid-template-columns:1fr; 
      gap: 20px; 
    }
    .stats-row { 
      grid-template-columns:1fr; 
      gap: 12px;
    }
    .stat-card {
      padding: 24px 16px;
    }

    .footer-grid { 
      grid-template-columns:1fr; 
      gap: 40px; 
    }
    .footer-bg { 
      padding: 60px 24px 32px; 
    }
    .footer-bottom { 
      flex-direction: column; 
      align-items: center; 
      text-align: center;
      gap: 12px; 
    }

    .sec-inner { 
      padding: 60px 20px; 
    }
    .timing-block {
      padding: 28px 24px;
    }
  }

  @media (max-width: 480px) {
    .hero-logo-img-main { 
      height: clamp(80px, 24vw, 120px); 
    }
    .hero-logo-img-name { 
      height: clamp(50px, 16vw, 80px); 
    }
    .hero-badge {
      font-size: 10px;
      padding: 6px 12px;
    }
    .svc-card { 
      width: 85vw; 
      height: 380px; 
    }
    .sec-number { display: none; }
    .btn-red, .btn-outline-cream {
      padding: 14px 28px;
      font-size: 11px;
    }
    .stat-num {
      font-size: 36px;
    }
  }

  /* Touch device optimizations */
  @media (hover: none) {
    .svc-card:hover {
      transform: none;
    }
    .hero-logo-img-main:hover,
    .hero-logo-img-name:hover {
      transform: none;
    }
  }
`;

/* ══════════════════════════════════════════
   HOOKS
══════════════════════════════════════════ */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, delay = 0, style = {} }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal" style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════ */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navItems = [
    { name: "Menu", href: "/menu" },
    { name: "Deals", href: "/deals" },
    { name: "Catering", href: "/catering" },
    { name: "Ballroom", href: "/ballroom" },
    // { name: "Locations", href: "#locations" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <nav className="nav" style={{
        background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.85)',
        boxShadow: scrolled ? '0 4px 30px rgba(0, 0, 0, 0.1)' : '0 4px 30px rgba(0, 0, 0, 0.05)'
      }}>
        <div className="nav-inner">
          <a href="#home" className="nav-logo" onClick={() => setMenuOpen(false)}>
            <div className="nav-brand-wrap">
              <span className="nav-brand-main">Al&#8209;Haaj <span>Akhtar</span> &amp; Sons</span>
              <span className="nav-brand-sub">Food Planning Group · Est. 1971</span>
            </div>
          </a>

          <div className="nav-links">
            {navItems.map(item => (
              <a key={item.name} href={item.href} className="nav-link">{item.name}</a>
            ))}
          </div>

          <a href="#contact" className="nav-cta">Book Now</a>

          <button
            className={`nav-hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`nav-mobile-menu${menuOpen ? " open" : ""}`} aria-hidden={!menuOpen}>
        {navItems.map(item => (
          <a key={item.name} href={item.href} className="nav-mobile-link"
            onClick={() => setMenuOpen(false)}>{item.name}</a>
        ))}
        <a href="/ballroom" className="nav-mobile-cta" onClick={() => setMenuOpen(false)}>Book Ballroom</a>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════
   FLORAL BAND
══════════════════════════════════════════ */
function FloralBand() {
  return (
    <div className="floral-band">
      <div className="floral-body" />
    </div>
  );
}

/* ══════════════════════════════════════════
   HERO
══════════════════════════════════════════ */
function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 15,
        y: (e.clientY / window.innerHeight - 0.5) * 15,
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <section className="hero" id="home">
        {/* Background layers */}
        <div className="hero-base" />
        <div className="hero-glow-red" />
        <div className="hero-glow-blue" />
        <div className="hero-topline" />
        <div className="hero-pattern" />

        {/* Building image — bleeds right */}
        <img
          src={RESTAURANT_IMG}
          alt="Al-Haaj Restaurant Building"
          className="hero-building-img"
          loading="lazy"
          style={{
            transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px) scale(1.06)`,
          }}
        />
        {/* Gradient fades building into dark bg */}
        <div className="hero-overlay" />
        <div className="hero-vignette" />

        {/* Main layout wrapper */}
        <div className="hero-layout">
          {/* Content */}
          <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge anim-1">
            <span className="hero-badge-dot" />
            Trusted Since 1971
          </div>

          {/* Both logos side by side */}
          <div className="hero-logos-row anim-2">
            <div className="hero-logo-circle-wrap">
              <img src={LOGO} alt="Al-Haaj Akhtar Logo" className="hero-logo-circle-img" />
            </div>
            <div className="hero-logo-divider-v" />
            <div className="hero-logo-name-wrap">
              <img src={LOGO_NAME} alt="Al-Haaj Akhtar Name" className="hero-logo-name-img" />
              <span className="hero-est-tag">Food Planning Group · Est. 1971</span>
            </div>
          </div>

          {/* Decorative divider */}
          <div className="hero-ornament anim-3">
            <div className="hero-orn-line" />
            <div className="hero-orn-dot" />
            <div className="hero-orn-diamond" />
            <div className="hero-orn-dot" />
            <div className="hero-orn-line hero-orn-line-fade" />
          </div>

          {/* Description */}
          <p className="hero-desc anim-3">
            Karachi's most beloved <strong>Food Planning Group</strong> — authentic
            Pakistani cuisine, grand ballroom events, and catering services for over 50 years.
          </p>

          {/* Buttons */}
          <div className="hero-btns anim-4">
            <a href="#catering" className="btn-red">
              Explore Services <span>→</span>
            </a>
            <a href="#ballroom" className="btn-outline-cream">
              Book Ballroom <span>→</span>
            </a>
          </div>
          </div>

          {/* Stats */}
          <div className="hero-stats anim-4">
          <div className="hero-stat">
            <div className="hero-stat-num">50+</div>
            <div className="hero-stat-lbl">Years Legacy</div>
          </div>
          <div className="hero-stat-sep" />
          <div className="hero-stat">
            <div className="hero-stat-num">3</div>
            <div className="hero-stat-lbl">Locations</div>
          </div>
          <div className="hero-stat-sep" />
          <div className="hero-stat">
            <div className="hero-stat-num">938</div>
            <div className="hero-stat-lbl">Menu Items</div>
          </div>
        </div>
        </div>

        <div className="scroll-cue">
          <div className="scroll-dot" />
          <span>Scroll to explore</span>
        </div>
      </section>
      <FloralBand />
    </>
  );
}

/* ══════════════════════════════════════════
   LEGACY / ABOUT
══════════════════════════════════════════ */
function Legacy() {
  return (
    <section className="legacy-sec" id="about">
      <div className="sec-inner">
        <div className="legacy-grid">
          <div>
            <Reveal>
              <span className="sec-label">Our Heritage</span>
              <h2 className="sec-title">Half a Century of<br /><em>Culinary Excellence</em></h2>
              <div className="section-header-line" />
            </Reveal>
            <div className="legacy-text">
              <Reveal delay={100}>
                <p>Founded in 1971 by Al Haaj Akhtar, our family legacy spans over five decades of serving the finest Pakistani cuisine to Karachi and beyond. From intimate family dinners to grand wedding banquets, we have been the trusted name in hospitality.</p>
              </Reveal>
              <Reveal delay={180}>
                <p>What started as a single restaurant grew into a full-service Food Planning Group — premium dining, catering, and event management across three Karachi campuses.</p>
              </Reveal>
            </div>
            <Reveal delay={280}>
              <div className="stats-row">
                {[["50+","Years of Excellence"],["3","Karachi Locations"],["∞","Memories Created"]].map(([n, l]) => (
                  <div key={l} className="stat-card">
                    <div className="stat-num">{n}</div>
                    <div className="stat-lbl">{l}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal>
            <div style={{ display:"flex", justifyContent:"center" }}>
              <img src={FIFTY_IMG} alt="50 Years" className="badge-img" loading="lazy" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   SERVICES
══════════════════════════════════════════ */
const services = [
  {
    badge: "Ballroom & Events",
    title: "Grand Ballroom",
    desc: "A magnificent venue for weddings, corporate dinners, and celebrations. Elegant ambiance, bespoke décor, and flawless service from our dedicated event team.",
    img: BALLROOM_IMG,
    imgAlt: "Al-Haaj Ballroom",
    cta: "Book Now",
    href: "/ballroom",
  },
  {
    badge: "Dine In · Take Away",
    title: "Pakwan Restaurant",
    desc: "Authentic Pakistani cuisine prepared with time-honoured recipes, premium ingredients, and genuine hospitality across all three Karachi locations.",
    img: RESTAURANT_IMG,
    imgAlt: "Pakwan Restaurant",
    cta: "View Menu",
    href: "/menu",
  },
  {
    badge: "Catering Services",
    title: "Events & Catering",
    desc: "From intimate gatherings to large-scale banquets, our catering team delivers restaurant-quality food directly to your venue with fully customisable menus.",
    img: CATERING_IMG,
    imgAlt: "Catering Services",
    cta: "Get a Quote",
    href: "/catering",
  },
];

function Services() {
  const trackRef = useRef(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let isDown = false, startX = 0, scrollLeft = 0;
    const onDown = e => { 
      isDown = true; 
      el.style.cursor = 'grabbing';
      startX = e.pageX - el.offsetLeft; 
      scrollLeft = el.scrollLeft; 
    };
    const onUp = () => { 
      isDown = false; 
      el.style.cursor = 'grab';
    };
    const onMove = e => { 
      if (!isDown) return; 
      e.preventDefault(); 
      const x = e.pageX - el.offsetLeft; 
      el.scrollLeft = scrollLeft - (x - startX) * 1.5; 
    };
    el.addEventListener('mousedown', onDown);
    el.addEventListener('mouseleave', onUp);
    el.addEventListener('mouseup', onUp);
    el.addEventListener('mousemove', onMove);
    return () => { 
      el.removeEventListener('mousedown', onDown); 
      el.removeEventListener('mouseleave', onUp); 
      el.removeEventListener('mouseup', onUp); 
      el.removeEventListener('mousemove', onMove); 
    };
  }, []);

  return (
    <section className="services-sec" id="catering">
      <div className="sec-inner" style={{ paddingBottom:0 }}>
        <Reveal>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:24 }}>
            <div>
              <span className="sec-label">What We Offer</span>
              <h2 className="sec-title">Crafted for Every<br /><em>Occasion</em></h2>
              <div className="section-header-line" />
            </div>
            <div className="sec-number">03</div>
          </div>
        </Reveal>
      </div>

      <div className="svc-track-wrap" ref={trackRef}>
        <div className="svc-track">
          {services.map((s, i) => (
            <Reveal key={s.badge} delay={i * 100}>
              <div className="svc-card">
                {s.img
                  ? <img src={s.img} alt={s.imgAlt} className="svc-img" loading="lazy" />
                  : <div className="svc-img-placeholder">{i === 1 ? "🍽" : "🤝"}</div>
                }
                <div className="svc-img-overlay" />
                <div className="svc-badge">{s.badge}</div>
                <div className="svc-body">
                  <div className="svc-title">{s.title}</div>
                  <p className="svc-desc">{s.desc}</p>
                  <a href={s.href} className="svc-cta">
                    {s.cta} <span className="svc-cta-arrow">→</span>
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="sec-inner" style={{ paddingTop:20, paddingBottom:80 }}>
        <p className="svc-drag-hint">← drag to explore →</p>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   LOCATIONS
══════════════════════════════════════════ */
const locs = [
  { tag:"Campus 01", name:"Nagan Campus", addr:"Main Location, Karachi\nServing Northern Karachi", loc: "https://maps.app.goo.gl/4D3ybuzmECzhszE29" },
  { tag:"Campus 02", name:"Gulshan Campus", addr:"Gulshan-e-Iqbal, Karachi\nAccessible & Central", loc:"https://maps.app.goo.gl/DBe1FXPp2VjavGkSA" },
  { tag:"Campus 03", name:"Johar Campus", addr:"Gulistan-e-Johar, Karachi\nServing since 1971", loc:"" },
];

function Locations() {
  return (
    <section className="locations-sec" id="locations">
      <div className="sec-inner">
        <Reveal>
          <span className="sec-label">Find Us</span>
          <h2 className="sec-title">Our <em>Locations</em><br />Across Karachi</h2>
          <div className="section-header-line" style={{ background:"linear-gradient(90deg,#FBE8CB,rgba(255,255,255,0.25))" }} />
        </Reveal>
        <div className="loc-grid">
          {locs.map((l, i) => (
            <Reveal key={l.name} delay={i * 120}>
              <div className="loc-card">
                <div className="loc-tag">{l.tag}</div>
                <div className="loc-name">{l.name}</div>
                <p className="loc-addr">{l.addr}</p>
                <a href={l.loc} className="loc-link">View on Map →</a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   TIMINGS
══════════════════════════════════════════ */
function Timings() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);
  const h = now.getHours(), m = now.getMinutes();
  const h12 = h % 12 || 12;
  const timeStr = `${h12}:${String(m).padStart(2,"0")} ${h >= 12 ? "PM" : "AM"}`;
  const dinnerAvail = h >= 17;
  const breakfastAvail = h >= 11 && h < 14;

  return (
    <section className="timings-sec" id="timings">
      <div className="sec-inner">
        <Reveal>
          <span className="sec-label">We're Open</span>
          <h2 className="sec-title">Restaurant <em>Timings</em><br />&amp; Menu Availability</h2>
          <div className="section-header-line" />
        </Reveal>
        <div className="timing-grid">
          <Reveal>
            <div className="timing-block">
              <div className="timing-block-title">Opening Hours</div>
              {[
                ["Mon – Fri","11:00 AM – 1:00 AM"],
                ["Sat – Sun","11:00 AM – 2:00 AM"],
                ["Kitchen closes","30 min before closing"],
              ].map(([lb, vl]) => (
                <div key={lb} className="timing-row">
                  <span className="timing-label">{lb}</span>
                  <span className="timing-value">{vl}</span>
                </div>
              ))}
              <div className="live-time">Now: {timeStr}</div>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="timing-block">
              <div className="timing-block-title">Menu Availability</div>
              {[
                { lbl:"Full Menu", tag:"All Day", avail:true },
                { lbl:"Dinner Menu", tag: dinnerAvail ? "Available Now" : "After 5:00 PM", avail: dinnerAvail },
                { lbl:"Breakfast", tag: breakfastAvail ? "Available Now" : "11 AM – 2 PM", avail: breakfastAvail },
              ].map(({ lbl, tag, avail }) => (
                <div key={lbl} className="timing-row">
                  <span className="timing-label">{lbl}</span>
                  <span className={`menu-tag ${avail ? "tag-avail" : "tag-unavail"}`}>{tag}</span>
                </div>
              ))}
              <div style={{ paddingTop:18, fontSize:12, color:"#a09070", fontStyle:"italic" }}>
                Updates automatically in real-time
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   FOOTER
══════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="footer-bg" id="contact">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="footer-logo-circle">A</div>
            <div className="footer-brand-name">Al Haaj Akhtar &amp; Sons</div>
            <p className="footer-tagline">Food Planning Group · Pakwan Restaurant · Ball Room. Serving Karachi with pride since 1971.</p>
            <div className="social-row">
              {["f","in","X","▶"].map(ic => (
                <a key={ic} href="#" className="social-ico">{ic}</a>
              ))}
            </div>
          </div>

          <div>
            <div className="footer-heading">Navigate</div>
            <ul className="footer-links">
              {["Home","Catering","Ballroom","Locations","Timings"].map(l => (
                <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <div className="footer-heading">Contact</div>
            <div className="footer-contact">
              Karachi, Pakistan<br />
              <a href="tel:+92000000000">0336-3667859</a><br />
              <a href="mailto:info@alhaajakhtar.com">info@alhaajakhtar.com</a>
            </div>
            <a href="https://wa.me/92000000000" className="wa-btn">WhatsApp Us</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Al Haaj Akhtar &amp; Sons. All rights reserved.</span>
          <span className="footer-since">Al Haaj Jo Rahe · Har Pal Aapke Sath Sath</span>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════
   ROOT
══════════════════════════════════════════ */
export default function AlHaajLanding() {
  return (
    <>
      <style>{styles}</style>
      <Navbar />
      <Hero />
      <Legacy />
      <Services />
      <Locations />
      <Timings />
      <Footer />
    </>
  );
}
