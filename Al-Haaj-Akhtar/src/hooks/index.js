import { useState, useEffect, useRef } from 'react'

// WhatsApp Numbers for different services
export const RESTAURANT_WHATSAPP = "+923001234567"  // Menu orders
export const CATERING_WHATSAPP = "+923009876543"   // Catering inquiries
export const BALLROOM_WHATSAPP = "+923005555555"   // Ballroom bookings

// Branch-specific WhatsApp Numbers
export const JOHAR_RESTAURANT_WHATSAPP = "+923452899485"   // Jauhar Restaurant
export const NAGAN_RESTAURANT_WHATSAPP = "+923363667859"   // Nagan Restaurant

export const whyChooseUs = [
  { icon: '👨‍🍳', title: 'Expert Chefs', desc: 'Authentic recipes passed down through generations' },
  { icon: '🥩', title: 'Premium Quality', desc: 'Only the finest halal ingredients selected daily' },
  { icon: '🏛️', title: 'Royal Ambiance', desc: 'Elegant dining experience fit for royalty' },
  { icon: '⭐', title: '25+ Years Legacy', desc: 'Serving excellence since 1999' },
]

export const reviews = [
  { name: 'Ahmed K.', text: 'The biryani here is absolutely phenomenal! The aroma, the taste - truly fit for a king.', rating: 5 },
  { name: 'Sara M.', text: 'Best karahi in the city! The royal ambiance makes every visit special.', rating: 5 },
  { name: 'Bilal R.', text: 'Hosted our family gathering here. The catering was impeccable and the food divine!', rating: 5 },
  { name: 'Fatima A.', text: 'The nihari breakfast is a must-try. Authentic flavors that remind me of home.', rating: 5 },
]

// Send WhatsApp message to appropriate number based on service type
export function sendWhatsAppMessage(type, message) {
  let phoneNumber = RESTAURANT_WHATSAPP
  
  switch(type) {
    case 'catering':
      phoneNumber = CATERING_WHATSAPP
      break
    case 'ballroom':
      phoneNumber = BALLROOM_WHATSAPP
      break
    case 'restaurant':
    default:
      phoneNumber = RESTAURANT_WHATSAPP
  }
  
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
  window.open(whatsappUrl, '_blank')
}

// Generate booking message for Catering
export function generateCateringMessage(packageName, guests, date, specialRequests) {
  return `🎉 CATERING INQUIRY - Al Haj Akhtar\n\n` +
    `📦 Package: ${packageName}\n` +
    `👥 Guests: ${guests}\n` +
    `📅 Date: ${date}\n` +
    `${specialRequests ? `📝 Special Requests: ${specialRequests}\n\n` : '\n'}` +
    `⏰ Inquiry Time: ${new Date().toLocaleString()}\n\n` +
    `Please confirm availability and pricing. Thank you!`
}

// Generate booking message for Ballroom
export function generateBallroomMessage(eventType, guests, date, duration, specialRequests, hallName = 'Hall A') {
  return `🎊 BALLROOM BOOKING - Al Haj Akhtar\n\n` +
    `🏛️ Hall: ${hallName}\n` +
    `🎭 Event Type: ${eventType}\n` +
    `👥 Guests: ${guests}\n` +
    `📅 Date: ${date}\n` +
    `⏱️ Duration: ${duration}\n` +
    `${specialRequests ? `📝 Special Requests: ${specialRequests}\n\n` : '\n'}` +
    `⏰ Inquiry Time: ${new Date().toLocaleString()}\n\n` +
    `Please confirm availability and pricing. Thank you!`
}

export function useCart() {
  // Load cart from sessionStorage on init
  const [cart, setCart] = useState(() => {
    const saved = sessionStorage.getItem('htk_cart')
    return saved ? JSON.parse(saved) : []
  })
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)

  // Save cart to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('htk_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(i => i.id !== itemId))
  }

  const updateQuantity = (itemId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + delta
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
      }
      return item
    }).filter(item => item.quantity > 0))
  }

  const clearCart = () => {
    setCart([])
    sessionStorage.removeItem('htk_cart')
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const sendWhatsAppOrder = (customerName, customerAddress, specialInstructions, branchId = 'jauhar') => {
    if (!customerName || !customerAddress) {
      alert('Please enter your name and address')
      return { success: false }
    }

    // Generate unique order ID
    const orderId = 'AHA-' + Date.now().toString(36).toUpperCase()

    // Branch WhatsApp numbers
    const branchNumbers = {
      'jauhar': '+923452899485',
      'gulshan': '+923009876543',
      'nagan': '+923363667859'
    }

    const branchWhatsApp = branchNumbers[branchId] || branchNumbers['jauhar']
    const branchNames = { 'jauhar': 'Jauhar Campus', 'gulshan': 'Gulshan Campus', 'nagan': 'Nagan Head Office' }

    const orderDetails = cart.map(item => {
      const nameWithFlavour = item.selectedFlavour ? `${item.selectedFlavour} ${item.name}` : item.name
      const emoji = item.emoji || ''
      return `${emoji} ${nameWithFlavour} x${item.quantity} = Rs. ${item.price * item.quantity}`
    }).join('\n')

    const message = `👑 NEW ORDER - Al Haj Akhtar\n\n` +
      `🆔 Order ID: ${orderId}\n` +
      `👤 Customer: ${customerName}\n` +
      `📍 Address: ${customerAddress}\n` +
      `🏪 Branch: ${branchNames[branchId] || 'Jauhar Campus'}\n\n` +
      `📋 Order Details:\n${orderDetails}\n\n` +
      `💰 Total: Rs. ${cartTotal}\n\n` +
      `${specialInstructions ? `📝 Special Instructions: ${specialInstructions}\n\n` : ''}` +
      `⏰ Order Time: ${new Date().toLocaleString()}\n\n` +
      `Thank you for choosing Al Haj Akhtar!`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${branchWhatsApp}?text=${encodedMessage}`

    window.open(whatsappUrl, '_blank')

    clearCart()
    setIsOrderModalOpen(false)
    return { success: true, orderId }
  }

  return {
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
  }
}

export function useScroll() {
  const [scrolled, setScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  return { scrolled, isMenuOpen, setIsMenuOpen, scrollToSection }
}

// Re-export scroll reveal hook
export { useScrollReveal, useScrollProgress } from './useScrollReveal'

// useReveal hook for scroll animations (from AlHaajLanding)
export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}
