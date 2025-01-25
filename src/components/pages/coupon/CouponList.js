import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CouponList.css';

const CouponList = () => {
  const [couponsData, setCoupons] = useState([]);
  const [editCoupon, setEditCoupon] = useState(null);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');

  const token = JSON.parse(localStorage.getItem("persist:root"))?.auth
    ? JSON.parse(JSON.parse(localStorage.getItem("persist:root")).auth).token
    : null;

  useEffect(() => {
    fetchCoupons();
  }, []);



  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`https://anneca-backend-sepia.vercel.app/api/v1/coupon`, {
        headers: { Authorization: token }
      });
      setCoupons(response.data.data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setMessage('Failed to fetch coupons. Please try again.');
    }
  };

  const deleteCoupon = async (id) => {
    try {
      await axios.delete(`https://anneca-backend-sepia.vercel.app/api/v1/coupon/${id}`, {
        headers: { Authorization: token }
      });
      setCoupons(couponsData.filter((coupon) => coupon._id !== id));
      setMessage('Coupon deleted successfully');
    } catch (error) {
      console.error('Error deleting coupon:', error);
      setMessage('Failed to delete coupon. Please try again.');
    }
  };

  const handleEdit = (coupon) => {
    setEditCoupon(coupon._id);
    setFormData({
      ...coupon,
      expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0]
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = async (e, id) => {
    e.preventDefault();
    try {
      await axios.put(`https://anneca-backend-sepia.vercel.app/api/v1/coupon/${id}`, formData, {
        headers: { Authorization: token }
      });
      setEditCoupon(null);
      fetchCoupons();
      setMessage('Coupon updated successfully');
    } catch (error) {
      console.error('Error updating coupon:', error);
      setMessage('Failed to update coupon. Please try again.');
    }
  };

  return (
    <div className="coupon-list-container">
      <h1>Manage Coupons</h1>
      {message && <div className="message">{message}</div>}

      <table className="coupon-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Discount Type</th>
            <th>Discount Value</th>
            <th>Expiry Date</th>
            <th>Usage Limit</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {couponsData.map((coupon) => (
            <tr key={coupon._id}>
              <td>{coupon.code}</td>
              <td>{coupon.discountType}</td>
              <td>{coupon.discountValue}</td>
              <td>{new Date(coupon.expiryDate).toLocaleDateString()}</td>
              <td>{coupon.usageLimit}</td>
              <td>
                <button onClick={() => handleEdit(coupon)}>Edit</button>
                <button onClick={() => deleteCoupon(coupon._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editCoupon && (
        <div className="edit-form">
          <h2>Edit Coupon</h2>
          <form onSubmit={(e) => handleUpdateSubmit(e, editCoupon)}>
            <div className="form-group">
              <label htmlFor="code">Coupon Code</label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="discountType">Discount Type</label>
              <select
                id="discountType"
                name="discountType"
                value={formData.discountType}
                onChange={handleInputChange}
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="discountValue">Discount Value</label>
              <input
                type="number"
                id="discountValue"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date</label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="usageLimit">Usage Limit</label>
              <input
                type="number"
                id="usageLimit"
                name="usageLimit"
                value={formData.usageLimit}
                onChange={handleInputChange}
              />
            </div>

            <button type="submit">Update Coupon</button>
            <button type="button" onClick={() => setEditCoupon(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CouponList;