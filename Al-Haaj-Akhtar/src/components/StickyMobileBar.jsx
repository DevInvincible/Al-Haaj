import { memo } from 'react'
import { WhatsAppIcon, CalendarIcon } from '../icons'
import { RESTAURANT_WHATSAPP, CATERING_WHATSAPP } from '../hooks'
import { useNavigate } from 'react-router-dom'

function StickyMobileBar() {
  const navigate = useNavigate()
  
  // Only show on mobile
  const isMobile = window.innerWidth < 768
  
  if (!isMobile) return null
  
  const handleOrderClick = () => {
    window.open(`https://wa.me/${RESTAURANT_WHATSAPP}`, '_blank')
  }
  
  const handleBookClick = () => {
    window.open(`https://wa.me/${CATERING_WHATSAPP}`, '_blank')
  }
  
  return (
    <div className="sticky-mobile-bar">
      <button className="sticky-btn-primary" onClick={handleOrderClick}>
        <WhatsAppIcon />
        <span>Order Food</span>
      </button>
      <button className="sticky-btn-secondary" onClick={handleBookClick}>
        <CalendarIcon />
        <span>Book Event</span>
      </button>
    </div>
  )
}

export default memo(StickyMobileBar)
