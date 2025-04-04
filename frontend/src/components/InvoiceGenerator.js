import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from 'react-router-dom'; // Corrected hook for navigation
import "../components/InvoiceGenerator.css";
import logo from "../assets/Sadguru Cloth Center.jpg";

const InvoiceGenerator = () => {
  const navigate = useNavigate(); // Initialize the navigate hook
  
  // Reset invoice number to 1 only if bills are deleted
  useEffect(() => {
    const savedBills = JSON.parse(localStorage.getItem("bills")) || [];
    if (savedBills.length === 0) {
      localStorage.setItem("invoiceNo", "1");  // Reset to 1 if no previous bills exist
    }
  }, []);

  // Initialize invoice number state
  const [invoiceNo, setInvoiceNo] = useState(() => {
    const savedInvoiceNo = localStorage.getItem("invoiceNo");
    return savedInvoiceNo ? parseInt(savedInvoiceNo, 10) : 1;
  });

  const [invoiceDate, setInvoiceDate] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientGST, setClientGST] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [items, setItems] = useState([{ id: 1, particulars: "", qty: "", rate: "", amount: 0 }]);

  // Handle item changes
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === "qty" || field === "rate" ? parseFloat(value) || 0 : value;
    newItems[index].amount = newItems[index].qty * newItems[index].rate;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { id: items.length + 1, particulars: "", qty: 0, rate: 0, amount: 0 }]);

  const deleteItem = (id) => setItems(items.filter(item => item.id !== id));

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const cgst = subtotal * 0.025;
    const sgst = subtotal * 0.025;
    return { subtotal, cgst, sgst, grandTotal: subtotal + cgst + sgst };
  };

  const saveBill = () => {
    const billData = { invoiceNo, invoiceDate, clientName, clientGST, clientAddress, items, totals: calculateTotals() };
    const savedBills = JSON.parse(localStorage.getItem("bills")) || [];
    savedBills.push(billData);
    localStorage.setItem("bills", JSON.stringify(savedBills));
    localStorage.setItem("invoiceNo", (invoiceNo + 1).toString()); // Increment invoice number
    setInvoiceNo(invoiceNo + 1);
    setItems([{ id: 1, particulars: "", qty: 0, rate: 0, amount: 0 }]);
    setClientName("");
    setClientGST("");
    setClientAddress("");
    setInvoiceDate("");
    alert("Bill saved successfully!");
  };

  const numberToWords = (num) => {
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const teens = ["Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const thousands = ["", "Thousand", "Lakh", "Crore"];
  
    if (num === 0) return "Zero Rupees";
  
    let words = "";
    let numStr = num.toFixed(2); // Ensures two decimal places
    let [integerPart, decimalPart] = numStr.split(".");
  
    const convertHundreds = (n) => {
      let str = "";
      if (n >= 100) {
        str += ones[Math.floor(n / 100)] + " Hundred ";
        n %= 100;
      }
      if (n >= 11 && n <= 19) {
        str += teens[n - 11] + " ";
      } else {
        str += tens[Math.floor(n / 10)] + " " + ones[n % 10] + " ";
      }
      return str.trim();
    };
  
    let numArr = [];
    while (integerPart.length > 0) {
      numArr.push(integerPart.slice(-2));
      integerPart = integerPart.slice(0, -2);
    }
  
    numArr.reverse().forEach((part, i) => {
      let number = parseInt(part, 10);
      if (number > 0) {
        words += convertHundreds(number) + " " + thousands[i] + " ";
      }
    });
  
    words = words.trim() + " Rupees";
    if (parseInt(decimalPart) > 0) {
      words += " and " + convertHundreds(parseInt(decimalPart)) + " Paise";
    }
    
    return words;
  };
  

  return (
    <div className="invoice-container">
      <div className="header">
        <div className="business-info">
          <div>
            <img
              src={logo}
              alt="Business Logo"
              style={{ height: "200px", width:"800px", display: "block", margin: "0 auto" }}
            />
          </div>
          <h3>Tax Invoice</h3>
          <p>Mob: 9881454802, 9021554700 | Office: 26351192 | Res.: 26336215</p>
          <p>Branch: 264, Nana Peth, Near Nana Peth Bhaji Mandai, Pune-411002</p>
          <p>Head Office: 617, Rasta Peth, Near Parsi Agyari, Pune-411011</p>
          <p>GSTIN: 27APKPN1685B1ZU</p>
        </div>
      </div>
      
      <div className="invoice-details">
        <label>Invoice No: {invoiceNo}</label>
        <label>To: <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} /></label>
        <label>GST No: 
  <input 
    type="text" 
    value={clientGST} 
    onChange={(e) => setClientGST(e.target.value.toUpperCase())} 
    pattern="^([0-3][0-9])[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$"
    title="Enter a valid GSTIN (15 characters: e.g., 27APKPN1685B1ZU)" 
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
        <label>Date: 
  <input 
    type="date" 
    value={invoiceDate} 
    onChange={(e) => setInvoiceDate(e.target.value)} 
    min="2025-04-01" 
    max="2026-03-31" 
    required 
  />
</label>

      </div>
      
      <table>
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>Particulars</th>
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
  <tr><td>Subtotal:</td><td>{calculateTotals().subtotal.toFixed(2)}</td></tr>
  <tr><td>CGST @ 2.5%:</td><td>{calculateTotals().cgst.toFixed(2)}</td></tr>
  <tr><td>SGST @ 2.5%:</td><td>{calculateTotals().sgst.toFixed(2)}</td></tr>
  <tr><td><b>Grand Total:</b></td><td><b>{calculateTotals().grandTotal.toFixed(2)}</b></td></tr>
  <tr><td><b>Amount in Words:</b></td><td><b>{numberToWords(calculateTotals().grandTotal)}</b></td></tr>
</table>

      </div>
      
      <div className="bank-details">
        <p><b>Bank: Punjab National Bank</b></p>
        <p>A/C No. & Type: 2901002100032112 (Current)</p>
        <p>Account Name: Sadguru Cloth Center and Tailor</p>
        <p>Branch: Nana Peth</p>
        <p>IFSC: PUNB0290100</p>
        <div className="receiver-signature">
          <span>Receiver's Sign: <span className="signature-line"></span></span>
          <span className="for-company">For Sadguru Cloth Center</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
