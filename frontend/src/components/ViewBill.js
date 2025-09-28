import React from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import logo from "../assets/shrig.jpeg"; 
import "../components/InvoiceGenerator.css";

const ViewBill = () => {
  const navigate = useNavigate(); // Initialize navigate
  const { state } = useLocation();
  const { bill } = state || {};

  if (!bill) {
    return <p>No bill data found.</p>;
  }

  // Function to convert number to words (same as in InvoiceGenerator)
  const numberToWords = (num) => {
    if (num === 0) return "Zero Rupees";

    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
      "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    const convertBelowHundred = (n) => {
      if (n < 20) return ones[n];
      return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    };

    const convertBelowThousand = (n) => {
      let str = "";
      if (Math.floor(n / 100) > 0) {
        str += ones[Math.floor(n / 100)] + " Hundred ";
        n %= 100;
      }
      if (n > 0) str += convertBelowHundred(n);
      return str.trim();
    };

    let result = "";
    let integerPart = Math.floor(num);
    let decimalPart = Math.round((num - integerPart) * 100);

    const crore = Math.floor(integerPart / 10000000);
    integerPart %= 10000000;
    const lakh = Math.floor(integerPart / 100000);
    integerPart %= 100000;
    const thousand = Math.floor(integerPart / 1000);
    integerPart %= 1000;
    const hundred = integerPart;

    if (crore > 0) result += convertBelowThousand(crore) + " Crore ";
    if (lakh > 0) result += convertBelowThousand(lakh) + " Lakh ";
    if (thousand > 0) result += convertBelowThousand(thousand) + " Thousand ";
    if (hundred > 0) result += convertBelowThousand(hundred);

    result = result.trim() + " Rupees";
    if (decimalPart > 0) {
      result += " and " + convertBelowHundred(decimalPart) + " Paise";
    }
    return result;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <div className="invoice-container">
      {/* Back Button */}
      <div style={{ margin: "10px 0" }}>
        <button
          onClick={() => navigate("/")} // Change "/" to your homepage route
          style={{ padding: "8px 16px", cursor: "pointer" }}
        >
          ← Back to Homepage
        </button>
      </div>

      <div className="header">
        <div className="business-info">
          <img
            src={logo}
            alt="Business Logo"
            style={{ height: "200px", width: "800px", display: "block", margin: "0 auto" }}
          />
          <h3>Tax Invoice</h3>
          <p>Branch: S.No.371, Flat No.20, Unity Park, Somwar Peth, Narpatgiri Chowk, Above HDFC Bank, Pune 411011.</p>
          <p>E-mail Id: shrigenterprises25@gmail.com</p>
          <p>Mob: 9850111166</p>
          <p>GSTIN: 27AJIPG2516N1Z2</p>
        </div>
      </div>

      <div className="invoice-details">
        <p><b>Invoice No:</b> {bill.invoiceNo}</p>
        <p><b>Date:</b> {formatDate(bill.invoiceDate)}</p>
        <p><b>To:</b> {bill.clientName}</p>
        <p><b>GST No:</b> {bill.clientGST}</p>
        <p><b>Address:</b> {bill.clientAddress}</p>
        <p><b>PO Number:</b> {bill.poNumber}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>Particulars</th>
            <th>HSN / SAC</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {bill.items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.particulars}</td>
              <td>{item.hsn}</td>
              <td>{item.qty}</td>
              <td>{item.rate}</td>
              <td>{item.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="summary-container">
        <table>
          <tbody>
            <tr><td>Subtotal:</td><td>{bill.totals.subtotal.toFixed(2)}</td></tr>
            <tr><td>CGST @ 9%:</td><td>{bill.totals.cgst.toFixed(2)}</td></tr>
            <tr><td>SGST @ 9%:</td><td>{bill.totals.sgst.toFixed(2)}</td></tr>
            <tr><td><b>Grand Total:</b></td><td><b>{bill.totals.grandTotal.toFixed(2)}</b></td></tr>
            <tr><td><b>Amount in Words:</b></td><td><b>{numberToWords(bill.totals.grandTotal)}</b></td></tr>
          </tbody>
        </table>
      </div>

      <div className="bank-details">
        <p><b>HDFC BANK</b></p>
        <p>A/C No. & Type: 50200095196440 (Current)</p>
        <p>Account Name: SHRI G ENTERPRISES</p>
        <p>Branch: Somwar Peth</p>
        <p>IFSC: HDFC0005383</p>
        <div className="receiver-signature">
          <span>Receiver's Sign: <span className="signature-line"></span></span>
          <span className="for-company">SHRI G ENTERPRISES</span>
        </div>
      </div>
    </div>
  );
};

export default ViewBill;
