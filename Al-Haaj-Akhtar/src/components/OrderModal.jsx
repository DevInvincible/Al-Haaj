import { useState, memo } from 'react'
import { CloseIcon, WhatsAppIcon, MapPinIcon, PhoneIcon, UserIcon, ClockIcon, ShoppingBagIcon } from '../icons'
import LocationSearch from './LocationSearch'

const branches = [
  { id: 'nagan', name: 'Nagan Head Office', phone: '+923363667859', address: 'Nagan Chowrangi, Karachi' },
  { id: 'gulshan', name: 'Gulshan Campus', phone: '+923009876543', address: 'Gulshan-e-Iqbal, Karachi' },
  { id: 'jauhar', name: 'Jauhar Campus', phone: '+923452899485', address: 'Gulistan-e-Jauhar, Karachi' }
]

function OrderModal({
  cart,
  cartTotal,
  isOrderModalOpen,
  setIsOrderModalOpen,
  sendWhatsAppOrder
}) {
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [selectedBranch, setSelectedBranch] = useState('nagan')
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  if (!isOrderModalOpen) return null

  const validateForm = () => {
    const newErrors = {}
    if (!customerName.trim()) newErrors.name = 'Please enter your name'
    if (!customerPhone.trim()) newErrors.phone = 'Please enter your phone number'
    if (!customerAddress.trim()) newErrors.address = 'Please enter your address'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setIsSubmitting(true)
    const result = sendWhatsAppOrder(customerName, customerAddress, specialInstructions, selectedBranch)
    if (result.success) {
      setOrderId(result.orderId)
      setOrderSuccess(true)
      setCustomerName('')
      setCustomerPhone('')
      setCustomerAddress('')
      setSpecialInstructions('')
      setErrors({})
      // Auto close after 5 seconds
      setTimeout(() => {
        setIsOrderModalOpen(false)
        setOrderSuccess(false)
        setOrderId('')
      }, 5000)
    }
    setIsSubmitting(false)
  }

  const selectedBranchData = branches.find(b => b.id === selectedBranch)

  const handleClose = () => {
    setIsOrderModalOpen(false)
    setOrderSuccess(false)
    setOrderId('')
  }

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px);
          z-index: 20000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }
        .order-modal {
          background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
          border: 1px solid rgba(200,16,46,0.3);
          border-radius: 20px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          z-index: 20001;
          animation: slideUp 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          scrollbar-width: thin;
          scrollbar-color: rgba(200,16,46,0.5) transparent;
        }
        .order-modal::-webkit-scrollbar {
          width: 6px;
        }
        .order-modal::-webkit-scrollbar-track {
          background: transparent;
        }
        .order-modal::-webkit-scrollbar-thumb {
          background: rgba(200,16,46,0.5);
          border-radius: 3px;
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px;
          border-bottom: 1px solid rgba(200,16,46,0.2);
        }
        .modal-header h3 {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          color: #fff;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .progress-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px 24px;
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(200,16,46,0.1);
        }
        .step {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: rgba(255,255,255,0.5);
        }
        .step.active {
          color: #C8102E;
        }
        .step-number {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 600;
        }
        .step.active .step-number {
          background: #C8102E;
          color: #fff;
        }
        .step-line {
          width: 30px;
          height: 1px;
          background: rgba(255,255,255,0.1);
        }
        .close-btn {
          background: rgba(255,255,255,0.1);
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          transition: all 0.3s ease;
        }
        .close-btn:hover {
          background: rgba(200,16,46,0.3);
        }
        .modal-content {
          padding: 24px;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .order-summary {
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
        }
        .order-summary h4 {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          color: #fff;
          margin: 0 0 16px 0;
        }
        .summary-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }
        .summary-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255,255,255,0.8);
          font-size: 14px;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .summary-item:last-child {
          border-bottom: none;
        }
        .summary-item-img {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          object-fit: cover;
          background: rgba(255,255,255,0.1);
        }
        .summary-item-info {
          flex: 1;
        }
        .summary-item-name {
          font-weight: 500;
          color: #fff;
          margin-bottom: 2px;
        }
        .summary-item-qty {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
        }
        .summary-total {
          display: flex;
          justify-content: space-between;
          color: #FBE8CB;
          font-weight: 600;
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 12px;
        }
        .order-success {
          text-align: center;
          padding: 20px;
        }
        .success-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        .order-success h4 {
          font-family: 'Playfair Display', serif;
          color: #fff;
          font-size: 18px;
          margin: 0 0 12px 0;
        }
        .order-id {
          color: #C8102E;
          font-size: 14px;
          margin-bottom: 12px;
        }
        .success-message, .success-note {
          color: rgba(255,255,255,0.7);
          font-size: 13px;
          margin-bottom: 8px;
        }
        .order-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-group label {
          color: #fff;
          font-size: 13px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .form-group label svg {
          width: 14px;
          height: 14px;
          color: #C8102E;
        }
        .error-message {
          color: #C8102E;
          font-size: 12px;
          margin-top: 4px;
        }
        .input-error {
          border-color: #C8102E !important;
        }
        .branch-info-card {
          background: rgba(200,16,46,0.1);
          border: 1px solid rgba(200,16,46,0.2);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
        }
        .branch-info-header {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #C8102E;
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 8px;
        }
        .branch-info-detail {
          display: flex;
          align-items: center;
          gap: 6px;
          color: rgba(255,255,255,0.7);
          font-size: 13px;
          margin-top: 4px;
        }
        .estimated-time {
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .estimated-time svg {
          color: #C8102E;
        }
        .estimated-time-text {
          font-size: 13px;
          color: rgba(255,255,255,0.8);
        }
        .form-group input,
        .form-group textarea,
        .form-group select {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          padding: 12px 16px;
          color: #fff;
          font-size: 14px;
          outline: none;
          transition: all 0.3s ease;
          width: 100%;
        }
        .form-group select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fff' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          padding-right: 40px;
        }
        .form-group select option {
          background: #1a1a1a;
          color: #fff;
        }
        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          border-color: #C8102E;
          background: rgba(255,255,255,0.15);
        }
        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: rgba(255,255,255,0.4);
        }
        .btn-primary {
          background: linear-gradient(135deg, #C8102E, #a00d25);
          border: none;
          border-radius: 12px;
          padding: 16px 24px;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
          font-size: 15px;
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(200,16,46,0.4);
        }
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .btn-primary.loading {
          opacity: 0.8;
        }
        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .form-note {
          text-align: center;
          color: rgba(255,255,255,0.5);
          font-size: 12px;
          margin-top: 16px;
        }
      `}</style>
      <div className="modal-overlay" onClick={handleClose}>
        <div className="order-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>{orderSuccess ? <><span>✅</span> Order Sent!</> : <><ShoppingBagIcon /> Complete Your Order</>}</h3>
            <button className="close-btn" onClick={handleClose}>
              <CloseIcon />
            </button>
          </div>
          
          {!orderSuccess && (
            <div className="progress-steps">
              <div className="step active">
                <span className="step-number">1</span>
                <span>Review</span>
              </div>
              <div className="step-line" />
              <div className="step">
                <span className="step-number">2</span>
                <span>Details</span>
              </div>
              <div className="step-line" />
              <div className="step">
                <span className="step-number">3</span>
                <span>Send</span>
              </div>
            </div>
          )}
        
        <div className="modal-content">
          {orderSuccess ? (
            <div className="order-success">
              <div className="success-icon">🎉</div>
              <h4>Thank you for your order!</h4>
              <p className="order-id">Order ID: <strong>{orderId}</strong></p>
              <p className="success-message">
                Your order has been sent to our WhatsApp. Please save this Order ID for reference.
              </p>
              <p className="success-note">
                We&apos;ll confirm your order shortly!
              </p>
            </div>
          ) : (
            <>
              <div className="order-summary">
                <h4>Order Summary ({cart.length} items)</h4>
                <div className="summary-items">
                  {cart.map(item => (
                    <div key={item.id} className="summary-item">
                      <img 
                        src={item.image || '/food/platter.jpg'} 
                        alt={item.name}
                        className="summary-item-img"
                        onError={(e) => e.target.src = '/food/platter.jpg'}
                      />
                      <div className="summary-item-info">
                        <div className="summary-item-name">
                          {item.emoji} {item.selectedFlavour ? `${item.selectedFlavour} ${item.name}` : item.name}
                        </div>
                        <div className="summary-item-qty">x{item.quantity}</div>
                      </div>
                      <span>Rs. {item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="summary-total">
                  <strong>Total:</strong>
                  <strong>Rs. {cartTotal}</strong>
                </div>
              </div>
              
              <div className="branch-info-card">
                <div className="branch-info-header">
                  <MapPinIcon /> Selected Branch
                </div>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  required
                  style={{width: '100%', marginBottom: '8px'}}
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                <div className="branch-info-detail">
                  <PhoneIcon /> {selectedBranchData?.phone}
                </div>
                <div className="branch-info-detail">
                  <MapPinIcon /> {selectedBranchData?.address}
                </div>
              </div>
              
              <div className="estimated-time">
                <ClockIcon />
                <div className="estimated-time-text">
                  Estimated delivery time: <strong>45-60 minutes</strong>
                </div>
              </div>
              
              <form className="order-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label><UserIcon /> Your Name *</label>
                  <input 
                    type="text" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className={errors.name ? 'input-error' : ''}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label><PhoneIcon /> Phone Number *</label>
                  <input 
                    type="tel" 
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    required
                    className={errors.phone ? 'input-error' : ''}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
                
                <div className="form-group">
                  <label><MapPinIcon /> Delivery Address *</label>
                  <LocationSearch 
                    onSelect={(location) => setCustomerAddress(location.fullAddress)}
                    placeholder="Search area (e.g., Gulshan, Clifton, DHA...)"
                  />
                  <textarea 
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="House/Building number, street, landmark..."
                    rows="2"
                    required
                    style={{marginTop: '8px'}}
                    className={errors.address ? 'input-error' : ''}
                  />
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>
                
                <div className="form-group">
                  <label>Special Instructions</label>
                  <textarea 
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Any special requests? (optional)"
                    rows="2"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className={`btn-primary full whatsapp-submit ${isSubmitting ? 'loading' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <><div className="spinner" /> Sending...</>
                  ) : (
                    <><WhatsAppIcon /> Send Order via WhatsApp</>
                  )}
                </button>
                
                <p className="form-note">
                  Your order will be sent directly to our WhatsApp. We&apos;ll confirm your order shortly!
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

export default memo(OrderModal)
