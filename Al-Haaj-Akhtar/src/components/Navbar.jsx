import { useState, useEffect, memo } from 'react';

const Navbar = memo(function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navItems = [
    { name: "Menu", href: "/menu" },
    { name: "Deals", href: "/deals" },
    { name: "Catering", href: "/catering" },
    { name: "Ballroom", href: "/ballroom" },
    { name: "Locations", href: "/#locations" }
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
      <style>{`
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 999;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        .nav-inner {
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 48px;
          max-width: 1400px;
          margin: 0 auto;
          gap: 32px;
        }
        .nav-logo {
          display: flex;
          align-items: baseline;
          gap: 0;
          text-decoration: none;
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }
        .nav-logo:hover { transform: scale(1.02); }
        .nav-brand-wrap {
          display: flex;
          flex-direction: column;
        }
        .nav-brand-main {
          font-family: 'Playfair Display', serif;
          font-size: clamp(20px, 2.5vw, 26px);
          font-weight: 700;
          color: #2A1000;
          letter-spacing: -0.01em;
          line-height: 1.1;
          white-space: nowrap;
        }
        .nav-brand-main span { 
          color: #C8102E; 
          font-weight: 600;
        }
        .nav-brand-sub {
          font-family: 'Inter', sans-serif;
          font-size: clamp(8px, 1vw, 10px);
          letter-spacing: 0.2em;
          color: #5a4030;
          font-weight: 600;
          text-transform: uppercase;
          margin-top: 4px;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: clamp(24px, 3vw, 40px);
          flex: 1;
          justify-content: center;
        }
        .nav-link {
          font-family: 'Inter', sans-serif;
          font-size: clamp(13px, 1.2vw, 15px);
          letter-spacing: 0.05em;
          color: #5a4030;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
          position: relative;
          padding: 8px 4px;
          white-space: nowrap;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 4px;
          right: 4px;
          height: 2px;
          background: #C8102E;
          transform: scaleX(0);
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          border-radius: 2px;
        }
        .nav-link:hover { color: #C8102E; }
        .nav-link:hover::after { transform: scaleX(1); }
        .nav-cta {
          background: linear-gradient(135deg, #C8102E 0%, #a00d25 100%);
          color: #fff;
          padding: 12px 28px;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          letter-spacing: 0.12em;
          font-weight: 600;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 4px;
          transition: all 0.3s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .nav-cta:hover {
          background: linear-gradient(135deg, #0033A0 0%, #001f6e 100%);
          box-shadow: 0 6px 25px rgba(0, 51, 160, 0.35);
          transform: translateY(-2px);
        }
        .nav-hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: none;
          border: none;
          cursor: pointer;
          padding: 10px;
          gap: 6px;
          width: 44px;
          height: 44px;
        }
        .nav-hamburger span {
          display: block;
          width: 24px;
          height: 2px;
          background: #2A1000;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          transform-origin: center;
        }
        .nav-hamburger.open span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
        .nav-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nav-hamburger.open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }
        .nav-mobile-menu {
          display: none;
          position: fixed;
          top: 80px;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(10, 10, 10, 0.98);
          backdrop-filter: blur(10px);
          flex-direction: column;
          padding: 40px;
          z-index: 998;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .nav-mobile-menu.open {
          display: flex;
          opacity: 1;
          pointer-events: all;
        }
        .nav-mobile-link {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 6vw, 36px);
          color: #fff;
          text-decoration: none;
          padding: 16px 0;
          border-bottom: 1px solid rgba(200, 16, 46, 0.2);
          transition: all 0.3s ease;
          opacity: 0.9;
        }
        .nav-mobile-link:hover {
          color: #C8102E;
          opacity: 1;
          transform: translateX(10px);
        }
        .nav-mobile-cta {
          background: linear-gradient(135deg, #C8102E, #a00d25);
          color: #fff;
          padding: 16px 40px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 600;
          text-decoration: none;
          border-radius: 4px;
          margin-top: 32px;
          text-align: center;
          transition: all 0.3s ease;
        }
        @media (max-width: 1024px) {
          .nav-inner { padding: 0 24px; }
        }
        @media (max-width: 768px) {
          .nav { z-index: 1001; }
          .nav-inner { height: 70px; padding: 0 20px; }
          .nav-links { display: none; }
          .nav-cta { display: none; }
          .nav-hamburger { display: flex; }
          .nav-mobile-menu { top: 70px; z-index: 1001; }
        }
      `}</style>
      <nav className="nav" style={{
        background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.85)',
        boxShadow: scrolled ? '0 4px 30px rgba(0, 0, 0, 0.1)' : '0 4px 30px rgba(0, 0, 0, 0.05)'
      }}>
        <div className="nav-inner">
          <a href="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
            <div className="nav-brand-wrap">
              <span className="nav-brand-main">Al‑Haaj <span>Akhtar</span> &amp; Sons</span>
              <span className="nav-brand-sub">Food Planning Group · Est. 1971</span>
            </div>
          </a>

          <div className="nav-links">
            {navItems.map(item => (
              <a key={item.name} href={item.href} className="nav-link">{item.name}</a>
            ))}
          </div>

          <a href="/ballroom" className="nav-cta">Book Now</a>

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
});

export default Navbar;
