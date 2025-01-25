import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import './Coupon.css';
import CouponList from './CouponList';

const Coupon = () => {
  const [couponData, setCouponData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    expiryDate: '',
    usageLimit: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCouponData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 
    setSuccess(false); 

    try {
      const response = await axios.post('https://anneca-backend-sepia.vercel.app/api/v1/coupon', couponData);
      
      console.log('Coupon created successfully:', response.data);
      setSuccess(true); // Set success to true
    } catch (error) {
      console.error('Error creating coupon:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data : 'Something went wrong. Please try again.'); 
    }
  };

  return (
    <div className="coupon-container">
      <div className="page-heading">
        <h1 className="page-heading-title">Create A New Coupon</h1>
      </div>

      {error && <div className="error-message">{error}</div>} {/* Display error */}
      {success && <div className="success-message">Coupon created successfully!</div>} {/* Display success */}

      <form onSubmit={handleSubmit} className="coupon-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="code">Coupon Code</label>
            <input
              id="code"
              name="code"
              value={couponData.code}
              onChange={handleInputChange}
              placeholder="Enter coupon code"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="discountType">Discount Type</label>
            <select
              id="discountType"
              name="discountType"
              value={couponData.discountType}
              onChange={handleInputChange}
              className='back'
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="discountValue">Discount Value</label>
            <input
              id="discountValue"
              name="discountValue"
              type="number"
              value={couponData.discountValue}
              className='back'
              onChange={handleInputChange}
              placeholder={couponData.discountType === 'percentage' ? 'Enter percentage' : 'Enter amount'}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              id="expiryDate"
              name="expiryDate"
              type="date"
              value={couponData.expiryDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="usageLimit">Usage Limit</label>
            <input
              id="usageLimit"
              name="usageLimit"
              type="number"
              className='back'
              value={couponData.usageLimit}
              onChange={handleInputChange}
              placeholder="Enter usage limit"
            />
          </div>
        </div>

        <button type="submit" className="submit-button">
          Save Coupon
        </button>
      </form>
      <CouponList />
    </div>
  );
};

export default Coupon;
