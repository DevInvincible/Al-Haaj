import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useCart, useScroll } from './hooks'

// Pages
import Home from './pages/Home'
import MenuPageNew from './pages/MenuPageNew'
import CateringPageNew from './pages/CateringPageNew'
import BallroomPageNew from './pages/BallroomPageNew'
import DealsPageNew from './pages/DealsPageNew'

function AppContent() {
  const location = useLocation()
  const isLandingPage = location.pathname === '/'
  
  // Hooks
  const { scrolled, isMenuOpen, setIsMenuOpen, scrollToSection } = useScroll()
  
  const {
    cart,
    cartTotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    isOrderModalOpen,
    setIsOrderModalOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    sendWhatsAppOrder
  } = useCart()
  

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={
          <Home scrollToSection={scrollToSection} cartCount={cartCount} />
        } />
        
        <Route path="/menu" element={
          <MenuPageNew 
            cart={cart}
            cartCount={cartCount}
            cartTotal={cartTotal}
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
            isOrderModalOpen={isOrderModalOpen}
            setIsOrderModalOpen={setIsOrderModalOpen}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
            sendWhatsAppOrder={sendWhatsAppOrder}
            addToCart={addToCart}
          />
        } />
        
        <Route path="/catering" element={<CateringPageNew />} />
        
        <Route path="/ballroom" element={<BallroomPageNew />} />
        
        <Route path="/deals" element={
          <DealsPageNew 
            cart={cart}
            cartCount={cartCount}
            cartTotal={cartTotal}
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
            isOrderModalOpen={isOrderModalOpen}
            setIsOrderModalOpen={setIsOrderModalOpen}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
            sendWhatsAppOrder={sendWhatsAppOrder}
            addToCart={addToCart}
          />
        } />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
