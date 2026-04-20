import { CartIcon } from '../icons'

import { memo } from 'react'

function FloatingCartButton({ cartCount, setIsCartOpen }) {
  const handleClick = () => {
    setIsCartOpen(true)
  }

  return (
    <button
      className="floating-cart-btn"
      onClick={handleClick}
      aria-label="Open cart"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #C8102E 0%, #a00d25 100%)',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 8px 30px rgba(200, 16, 46, 0.4)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <CartIcon />
      {cartCount > 0 && (
        <span className="cart-badge" style={{
          position: 'absolute',
          top: '-4px',
          right: '-4px',
          background: '#FBE8CB',
          color: '#C8102E',
          fontWeight: 700,
          fontSize: '12px',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>{cartCount}</span>
      )}
    </button>
  )
}

export default memo(FloatingCartButton)
