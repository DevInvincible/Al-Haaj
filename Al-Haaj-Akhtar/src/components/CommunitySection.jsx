import { memo } from 'react'

function CommunitySection() {
  return (
    <section className="community-section">
      <div className="container">
        <h3 className="community-title">#STRAIGHT FROM OUR COMMUNITY</h3>
        <div className="community-grid">
          <div className="community-item"><img src="/burger.png" alt="Burger" className="food-image" style={{width: '60px', height: '60px'}} loading="lazy" /></div>
          <div className="community-item"><img src="/chicken-leg.png" alt="Chicken" className="food-image" style={{width: '60px', height: '60px'}} loading="lazy" /></div>
          <div className="community-item"><img src="/french-fries.png" alt="Fries" className="food-image" style={{width: '60px', height: '60px'}} loading="lazy" /></div>
          <div className="community-item"><img src="/drink.png" alt="Drink" className="food-image" style={{width: '60px', height: '60px'}} loading="lazy" /></div>
          <div className="community-item"><img src="/wrap.png" alt="Wrap" className="food-image" style={{width: '60px', height: '60px'}} loading="lazy" /></div>
        </div>
      </div>
    </section>
  )
}

export default memo(CommunitySection)
