import React, { useState, useEffect } from "react";
import DateRangePicker from 'rsuite/DateRangePicker';
import axios from "axios";
import jsPDF from "jspdf"; // Import jsPDF
import "./order.css";
import { BASE_URL } from "../../config/Urls";
import "jspdf-autotable";
import 'rsuite/DateRangePicker/styles/index.css';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [timeFrame, setTimeFrame] = useState("1month");
  const [statusFilter, setStatusFilter] = useState("all");
  const [hasTodayOrders, setHasTodayOrders] = useState(false);
  const [datePicker, setDatePicker] = useState([]);

  useEffect(() => {
    fetchOrders(currentPage);
    checkTodayOrders();
  }, [currentPage, timeFrame, statusFilter, datePicker]);

  const token = JSON.parse(localStorage.getItem("persist:root"))?.auth
    ? JSON.parse(JSON.parse(localStorage.getItem("persist:root")).auth).token
    : null;

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const fetchOrders = async (page) => {
    setIsLoading(true);
    try {

      
      let sDate = '';
      let eDate = '';

      if (datePicker && datePicker[0] && datePicker[1]) {
        const startDate = new Date(new Date(datePicker[0]).getTime() + 5.5 * 60 * 60 * 1000);
        const endDate = new Date(new Date(datePicker[1]).getTime() + 5.5 * 60 * 60 * 1000);
      
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          console.error('Invalid date value');
        } else {
          sDate = startDate.toISOString();
          eDate = endDate.toISOString();
      
          console.log('Start Date:', sDate);
          console.log('End Date:', eDate);
        }
      } else {
        console.error('Invalid datePicker values');
      }
    
      const response = await axios.get(
        `${BASE_URL}order/admin/orders?page=${page}&limit=10&status=${statusFilter}&${datePicker?.length > 0 ? `startDate=${sDate}&endDate=${eDate}` : ""}&timeframe=${timeFrame}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setOrders(response.data.data);
      setTotalPages(response.data.totalPages);
      setIsLoading(false);
    } catch (err) {
      console.log("🚀 ~ fetchOrders ~ err:", err)
      setError("Failed to fetch orders. Please try again.");
      setIsLoading(false);
    }
  };

  const checkTodayOrders = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}order/admin/check-today-orders`,
        {
          headers: {
            Authorization: `${localStorage.getItem("user_token")}`,
          },
        }
      );
      setHasTodayOrders(response.data.hasTodayOrders);
    } catch (err) {
      console.error("Failed to check today's orders:", err);
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const downloadPDF = async () => {
    try {
      let sDate = '';
      let eDate = '';

      if (datePicker && datePicker[0] && datePicker[1]) {
        const startDate = new Date(new Date(datePicker[0]).getTime() + 5.5 * 60 * 60 * 1000);
        const endDate = new Date(new Date(datePicker[1]).getTime() + 5.5 * 60 * 60 * 1000);
      
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          console.error('Invalid date value');
        } else {
          sDate = startDate.toISOString();
          eDate = endDate.toISOString();
      
          console.log('Start Date:', sDate);
          console.log('End Date:', eDate);
        }
      } else {
        console.error('Invalid datePicker values');
      }
      
      const response = await axios.get(
        `${BASE_URL}order/admin/orders/report/${timeFrame}/${statusFilter}?${datePicker?.length > 0 ? `startDate=${sDate}&endDate=${eDate}` : ""}`,
        {
          headers: {
            Authorization: `${localStorage.getItem("user_token")}`,
          },
          responseType: "blob",
        }
      );

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `order_report_${timeFrame}_${statusFilter}.pdf`;
      link.click();
      URL.revokeObjectURL(fileURL);
    } catch (err) {
      setError("Failed to download PDF. Please try again.");
    }
  };

  const handleTimeFrameChange = (e) => {
    setTimeFrame(e.target.value);
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    pageNumbers.push(
      <li
        key="prev"
        className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
      >
        <button
          className="page-link"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
      </li>
    );

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={`page-item ${i === currentPage ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }

    pageNumbers.push(
      <li
        key="next"
        className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
      >
        <button
          className="page-link"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </li>
    );

    return pageNumbers;
  };

  if (isLoading) return <div className="text-center mt-5">Loading...</div>;
  if (error)
    return (
      <div className="alert alert-danger mt-5" role="alert">
        {error}
      </div>
    );

  const downloadInvoicePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    const addWrappedText = (text, x, y, maxWidth, lineHeight) => {
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return y + lines.length * lineHeight;
    };
    doc.setFont("helvetica");
    doc.setFontSize(24);
    doc.setTextColor(0);
    doc.text("Invoice", 14, 20);
    doc.setDrawColor(200);
    doc.line(14, 25, pageWidth - 14, 25);
    doc.setFontSize(10);
    doc.setTextColor(100);
    let y = 35;
    y = addWrappedText(`Order ID: ${selectedOrder._id}`, 14, y, 180, 5);
    y = addWrappedText(
      `Date: ${new Date(selectedOrder.createdAt).toLocaleDateString()}`,
      14,
      y,
      180,
      5
    );
    y = addWrappedText(
      `Order Status: ${selectedOrder.order_status}`,
      14,
      y,
      180,
      5
    );
    y = addWrappedText(
      `Payment Status: ${selectedOrder.payment_info.status}`,
      14,
      y,
      180,
      5
    );

    // Add Line
    y += 5;
    doc.line(14, y, pageWidth - 14, y);
    y += 10;

    // Add Shipping Information
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Shipping Information", 14, y);
    y += 5;
    doc.setFontSize(10);
    doc.setTextColor(100);
    const shippingInfo = `
        ${selectedOrder.shippingInfo.frist_name} ${selectedOrder.shippingInfo.last_name}
        ${selectedOrder.shippingInfo.address}, ${selectedOrder.shippingInfo.city}, 
        ${selectedOrder.shippingInfo.state}, ${selectedOrder.shippingInfo.country}
        ${selectedOrder.shippingInfo.postal_code}
        Phone: ${selectedOrder.shippingInfo.phone_no}
        Email: ${selectedOrder.user.email}
      `;
    y = addWrappedText(shippingInfo, 14, y, 180, 5);

    // Add Line
    y += 5;
    doc.line(14, y, pageWidth - 14, y);
    y += 10;

    // Add Order Items
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Order Items", 14, y);
    y += 10;

    // Create table for order items
    const tableColumn = ["Product", "Size", "Price", "Quantity", "Total"];
    const tableRows = selectedOrder.order_items.map((item) => [
      item.product.name,
      item.size,
      `${item.product_price.toFixed(2)}`,
      item.quantity,
      `${(item.total_price / 100).toFixed(2)}`,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: y,
      theme: "grid",
      headStyles: {
        fillColor: [26, 188, 156],
        textColor: 255,
        fontSize: 10,
      },
      bodyStyles: {
        textColor: 100,
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
      },
      margin: { left: 14, right: 14 },
    });

    // Add Total Amount
    y = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(
      `Total Amount: ${(selectedOrder.total_price / 100).toFixed(2)}`,
      14,
      y
    );

    // Add Footer
    y += 20;
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text("Thank you for your purchase!", 14, y);
    y += 5;
    doc.text("For any inquiries, please contact us.", 14, y);

    // Save the PDF
    doc.save(`invoice_${selectedOrder._id}.pdf`);
  };

  const getDateRange = () => {
    const endDate = new Date();
    let startDate;

    switch (timeFrame) {
      case "1day":
        startDate = new Date();
        startDate.setDate(endDate.getDate() - 1);
        break;
      case "1month":
        startDate = new Date();
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case "6months":
        startDate = new Date();
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case "1year":
        startDate = new Date();
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date();
    }

    return { startDate, endDate };
  };

  const { startDate, endDate } = getDateRange();

  return (
    <div className="container mt-5">
      {/* Time Frame Selection */}
      <div className="mb-4 flex items-center space-x-3">
        <label htmlFor="timeFrame" className="text-lg font-medium">
          Select Time Frame:
        </label>
        <select
          id="timeFrame"
          value={timeFrame}
          onChange={handleTimeFrameChange}
          className="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-300"
        >
          {hasTodayOrders && <option value="1day">Last 24 hours</option>}
          <option value="1month">Last 1 Month</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last 1 Year</option>
        </select>
        <button
          className="bg-blue-600 text-white font-semibold rounded-md px-4 py-2 shadow hover:bg-blue-500 transition duration-200"
          onClick={downloadPDF}
        >
          Download PDF
        </button>
        <label htmlFor="statusFilter" className="text-lg font-medium ml-4">
          Filter by Status:
        </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-300"
        >
          <option value="all">All Orders</option>
          <option value="Processing">Processing</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div className="mb-4 flex items-center space-x-3">
        <label htmlFor="statusFilter" className="text-lg font-medium">
          Date range:
        </label>
        <DateRangePicker
          defaultValue={datePicker}
          placeholder="Select Date"
          onChange={(e) => setDatePicker(e)}
          ranges={[
            {
              label: "Allowed Range",
              value: [startDate, endDate],
            },
          ]}
          disabledDate={(date) => {
            if (timeFrame === "1day") {
              return true;
            }
            return date < startDate || date > endDate;
          }}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order?._id}
                onClick={() => handleOrderClick(order)}
                className="cursor-pointer"
              >
                <td>{order?._id}</td>
                <td>{order.user.name}</td>
                <td>₹{(order.total_price / 100).toFixed(2)}</td>
                <td>{order.order_status}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center">
          {renderPagination()}
        </ul>
      </nav>

      {showModal && selectedOrder && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg shadow-lg max-w-7xl w-full p-10">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-3xl font-bold">Invoice</h3>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 text-3xl"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>

            {/* Invoice Header */}
            <div className="flex justify-between mb-6 border-b pb-4">
              <div>
                <h4 className="text-lg font-semibold">
                  Order ID: {selectedOrder?._id}
                </h4>
                <p className="text-sm text-gray-600">
                  Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold">
                  Order Status: {selectedOrder.order_status}
                </h4>
                <p className="text-sm text-gray-600">
                  Payment Status: {selectedOrder.payment_info.status}
                </p>
              </div>
            </div>

            {/* Shipping and Payment Information */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="text-lg font-semibold mb-2">
                  Shipping Information
                </h4>
                <p>
                  {selectedOrder.shippingInfo.frist_name}{" "}
                  {selectedOrder.shippingInfo.last_name}
                  <br />
                  {selectedOrder.shippingInfo.address},<br />
                  {selectedOrder.shippingInfo.city},{" "}
                  {selectedOrder.shippingInfo.state},{" "}
                  {selectedOrder.shippingInfo.country} -{" "}
                  {selectedOrder.shippingInfo.postal_code}
                  <br />
                  <strong>Phone:</strong> {selectedOrder.shippingInfo.phone_no}
                  <br />
                  <strong>Email:</strong> {selectedOrder.user.email}
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">
                  Payment Information
                </h4>
                <p>
                  <strong>Status:</strong> {selectedOrder.payment_info.status}
                  <br />
                  <strong>Paid At:</strong>{" "}
                  {new Date(selectedOrder.paidAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <h4 className="text-lg font-semibold mb-4">Order Items</h4>
            <ul className="border-t border-b py-4 mb-8">
              {selectedOrder?.order_items.map((item) => (
                <li
                  key={item?.product?._id}
                  className="flex justify-between items-center py-4 border-b last:border-b-0"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item?.product?.images[0].url}
                      alt={item?.product?.name}
                      className="h-16 w-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold">{item?.product?.name}</p>
                      <p className="text-sm text-gray-600">
                        Size: {item?.size}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p>
                      ₹{item?.product_price.toFixed(2)} x {item?.quantity}
                    </p>
                    <p className="font-semibold">
                      Total: ₹{(item?.total_price / 100).toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex justify-between">
              <button
                className="bg-pink-600 text-white font-semibold rounded-md px-4 py-2 shadow hover:bg-green-500 transition duration-200 mr-2"
                onClick={downloadInvoicePDF}
              >
                Download Invoice
              </button>
              <div className="font-bold">
                Total Amount: ₹{(selectedOrder?.total_price / 100).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
