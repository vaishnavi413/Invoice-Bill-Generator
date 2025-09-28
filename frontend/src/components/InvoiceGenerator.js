import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../components/InvoiceGenerator.css";
import logo from "../assets/shrig.jpeg";

const InvoiceGenerator = () => {
  const navigate = useNavigate();

  // Reset invoice number if no bills exist
  useEffect(() => {
    const savedBills = JSON.parse(localStorage.getItem("bills")) || [];
    if (savedBills.length === 0) {
      localStorage.setItem("invoiceNo", "1");
    }
  }, []);

  const [invoiceNo, setInvoiceNo] = useState(() => {
    const savedInvoiceNo = localStorage.getItem("invoiceNo");
    return savedInvoiceNo ? parseInt(savedInvoiceNo, 10) : 1;
  });

  const [invoiceDate, setInvoiceDate] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientGST, setClientGST] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [gstRate, setGstRate] = useState(9); // Default GST rate
  const [items, setItems] = useState([
    { id: 1, particulars: "", hsn: "", qty: 0, rate: 0, amount: 0 }
  ]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] =
      field === "qty" || field === "rate" ? parseFloat(value) || 0 : value;
    newItems[index].amount = newItems[index].qty * newItems[index].rate;
    setItems(newItems);
  };

  const addItem = () =>
    setItems([...items, { id: items.length + 1, particulars: "", hsn: "", qty: 0, rate: 0, amount: 0 }]);

  const deleteItem = (id) => setItems(items.filter(item => item.id !== id));

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const cgst = subtotal * (gstRate / 100);
    const sgst = subtotal * (gstRate / 100);
    return { subtotal, cgst, sgst, grandTotal: subtotal + cgst + sgst };
  };

  const saveBill = () => {
    const billData = {
      invoiceNo,
      invoiceDate,
      clientName,
      clientGST,
      clientAddress,
      poNumber,
      gstRate,
      items,
      totals: calculateTotals()
    };
    const savedBills = JSON.parse(localStorage.getItem("bills")) || [];
    savedBills.push(billData);
    localStorage.setItem("bills", JSON.stringify(savedBills));
    localStorage.setItem("invoiceNo", (invoiceNo + 1).toString());
    setInvoiceNo(invoiceNo + 1);
    setItems([{ id: 1, particulars: "", hsn: "", qty: 0, rate: 0, amount: 0 }]);
    setClientName("");
    setClientGST("");
    setClientAddress("");
    setPoNumber("");
    setInvoiceDate("");
    setGstRate(9);
    alert("Bill saved successfully!");
  };

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

  return (
    <div className="invoice-container">
      <div className="header">
        <div className="business-info">
          <img src={logo} alt="Business Logo" style={{ height: "200px", width: "800px", display: "block", margin: "0 auto" }} />
          <h3>Tax Invoice</h3>
          <p>Branch: S.No.371, Flat No.20, Unity Park, Somwar Peth, Narpatgiri Chowk,Above HDFC Bank,Pune 411011.</p>
          <p>E-mail Id:- shrigenterprises25@gmail.com</p>
          <p>Mob: 9850111166</p>
          <p>GSTIN: 27AJIPG2516N1Z2</p>
        </div>
      </div>

      <div className="invoice-details">
        <label>Invoice No: {invoiceNo}</label>
        <label>
          To:
          <textarea
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            rows={2}
            style={{ width: "100%" }}
          />
        </label>
        <label>
          GST No:
          <input
            type="text"
            value={clientGST}
            onChange={(e) => setClientGST(e.target.value.toUpperCase())}
            pattern="^([0-3][0-9])[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$"
            title="Enter a valid GSTIN (15 characters)"
            maxLength="15"
            required
          />
        </label>
        <label>
          Address:
          <textarea
            value={clientAddress}
            onChange={(e) => setClientAddress(e.target.value)}
            className="address-input"
          />
        </label>
        <label>
          PO Number:
          <input
            type="text"
            value={poNumber}
            onChange={(e) => setPoNumber(e.target.value)}
          />
        </label>
        <label>
          Date:
          <input
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
            min="2025-04-01"
            max="2026-03-31"
            required
          />
        </label>

 <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
  <b>Select GST Rate:</b>
  <label style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
    <input
      type="radio"
      name="gstRate"
      value={5}
      checked={gstRate === 5}
      onChange={() => setGstRate(5)}
    /> 
    5%
  </label>
  <span>OR</span>
  <label style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
    <input
      type="radio"
      name="gstRate"
      value={9}
      checked={gstRate === 9}
      onChange={() => setGstRate(9)}
    /> 
    9%
  </label>
</div>


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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td><input type="text" value={item.particulars} onChange={(e) => handleItemChange(index, "particulars", e.target.value)} /></td>
              <td><input type="text" value={item.hsn} onChange={(e) => handleItemChange(index, "hsn", e.target.value)} /></td>
              <td><input type="number" value={item.qty} onChange={(e) => handleItemChange(index, "qty", e.target.value)} /></td>
              <td><input type="number" value={item.rate} onChange={(e) => handleItemChange(index, "rate", e.target.value)} /></td>
              <td>{item.amount.toFixed(2)}</td>
              <td><button onClick={() => deleteItem(item.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={addItem}>Add Item</button>
      <button onClick={saveBill}>Save Bill</button>
      <button onClick={() => navigate("/previous-bills")}>Show Previous Bills</button>

      <div className="summary-container">
        <table>
          <tbody>
            <tr><td>Subtotal:</td><td>{calculateTotals().subtotal.toFixed(2)}</td></tr>
            <tr><td>CGST @{gstRate}%:</td><td>{calculateTotals().cgst.toFixed(2)}</td></tr>
            <tr><td>SGST @{gstRate}%:</td><td>{calculateTotals().sgst.toFixed(2)}</td></tr>
            <tr><td><b>Grand Total:</b></td><td><b>{calculateTotals().grandTotal.toFixed(2)}</b></td></tr>
            <tr><td><b>Amount in Words:</b></td><td><b>{numberToWords(calculateTotals().grandTotal)}</b></td></tr>
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

export default InvoiceGenerator;
