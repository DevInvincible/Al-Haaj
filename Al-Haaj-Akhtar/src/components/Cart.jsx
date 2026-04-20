import { memo } from 'react'
import { CloseIcon, MinusIcon, PlusIcon, TrashIcon } from '../icons'

function Cart({ 
  cart, 
  cartCount, 
  cartTotal, 
  isCartOpen, 
  setIsCartOpen, 
  updateQuantity, 
  removeFromCart, 
  clearCart, 
  setIsOrderModalOpen,
  scrollToSection
}) {
  if (!isCartOpen) return null

  return (
    <>
      <style>{`
        .cart-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          z-index: 10000;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .cart-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: 100%;
          max-width: 420px;
          height: 100vh;
          background: linear-gradient(180deg, #0a0a0a 0%, #141414 100%);
          border-left: 1px solid rgba(200,16,46,0.3);
          z-index: 10001;
          display: flex;
          flex-direction: column;
          animation: slideIn 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .cart-header {
          padding: 24px;
          border-bottom: 1px solid rgba(200,16,46,0.2);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(200,16,46,0.05);
        }
        .cart-header h3 {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          color: #FBE8CB;
          margin: 0;
        }
        .cart-close-btn {
          background: none;
          border: none;
          color: #FBE8CB;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .cart-close-btn:hover {
          background: rgba(200,16,46,0.2);
        }
        .cart-close-btn svg {
          width: 24px;
          height: 24px;
        }
        .cart-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          text-align: center;
        }
        .cart-empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
          opacity: 0.7;
        }
        .cart-empty p {
          color: rgba(255,255,255,0.5);
          font-size: 16px;
          margin: 0 0 24px 0;
        }
        .cart-browse-btn {
          padding: 14px 32px;
          background: linear-gradient(135deg, #C8102E 0%, #a00d25 100%);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }
        .cart-browse-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(200,16,46,0.3);
        }
        .cart-items {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }
        .cart-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          margin-bottom: 12px;
        }
        .cart-item-emoji {
          font-size: 32px;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
          flex-shrink: 0;
        }
        .cart-item-details {
          flex: 1;
          min-width: 0;
        }
        .cart-item-details h4 {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 4px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cart-item-price {
          color: #C8102E;
          font-weight: 600;
          font-size: 14px;
        }
        .cart-item-qty {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .qty-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.05);
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          padding: 0;
        }
        .qty-btn:hover {
          background: rgba(200,16,46,0.2);
          border-color: #C8102E;
        }
        .qty-btn svg {
          width: 14px;
          height: 14px;
        }
        .qty-value {
          font-weight: 600;
          color: #fff;
          min-width: 24px;
          text-align: center;
          font-size: 14px;
        }
        .cart-item-remove {
          background: none;
          border: none;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .cart-item-remove:hover {
          color: #C8102E;
          background: rgba(200,16,46,0.1);
        }
        .cart-item-remove svg {
          width: 18px;
          height: 18px;
        }
        .cart-footer {
          padding: 20px 24px 24px;
          border-top: 1px solid rgba(200,16,46,0.2);
          background: rgba(200,16,46,0.05);
        }
        .cart-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .cart-total-label {
          font-size: 16px;
          color: rgba(255,255,255,0.7);
        }
        .cart-total-amount {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          color: #FBE8CB;
          font-weight: 700;
        }
        .cart-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .checkout-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #C8102E 0%, #a00d25 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }
        .checkout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(200,16,46,0.3);
        }
        .clear-cart-btn {
          width: 100%;
          padding: 14px;
          background: transparent;
          color: rgba(255,255,255,0.5);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .clear-cart-btn:hover {
          border-color: #C8102E;
          color: #C8102E;
          background: rgba(200,16,46,0.05);
        }
      `}</style>
      <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
        <div className="cart-drawer" onClick={e => e.stopPropagation()}>
          <div className="cart-header">
            <h3>Your Cart ({cartCount})</h3>
            <button className="cart-close-btn" onClick={() => setIsCartOpen(false)}>
              <CloseIcon />
            </button>
          </div>
          
          {cart.length === 0 ? (
            <div className="cart-empty">
              <span className="cart-empty-icon">🛒</span>
              <p>Your cart is empty</p>
              <button className="cart-browse-btn" onClick={() => {setIsCartOpen(false); scrollToSection('menu')}}>
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    {/* <span className="cart-item-emoji">{item.emoji}</span> */}
                    <div className="cart-item-details">
                      <h4>{item.selectedFlavour ? `${item.selectedFlavour} ${item.name}` : item.name}</h4>
                      <span className="cart-item-price">Rs. {item.price}</span>
                    </div>
                    <div className="cart-item-qty">
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>
                        <MinusIcon />
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>
                        <PlusIcon />
                      </button>
                    </div>
                    <button 
                      className="cart-item-remove" 
                      onClick={() => removeFromCart(item.id)}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="cart-footer">
                <div className="cart-total-row">
                  <span className="cart-total-label">Total:</span>
                  <span className="cart-total-amount">Rs. {cartTotal}</span>
                </div>
                <div className="cart-actions">
                  <button 
                    className="checkout-btn"
                    onClick={() => {
                      setIsOrderModalOpen(true);
                    }}
                  >
                    Checkout
                  </button>
                  <button className="clear-cart-btn" onClick={clearCart}>
                    Clear Cart
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default memo(Cart)
