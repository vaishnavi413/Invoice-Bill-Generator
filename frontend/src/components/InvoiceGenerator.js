import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import "../components/InvoiceGenerator.css";
import logo from "../assets/Sadguru Cloth Center.jpg";

const InvoiceGenerator = () => {
  const navigate = useNavigate();

  // Reset invoice number when component mounts
  useEffect(() => {
    localStorage.setItem("invoiceNo", "1");  // Reset to 1
  }, []);

  // Initialize invoice number state
  const [invoiceNo, setInvoiceNo] = useState(() => {
    return 1;  // Always start from 1
  });

  const [invoiceDate, setInvoiceDate] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientGST, setClientGST] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [items, setItems] = useState([
    { id: 1, particulars: "", qty: "", rate: "", amount: 0 }
  ]);

  // Handle item changes
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === "qty" || field === "rate" ? parseFloat(value) || 0 : value;
    newItems[index].amount = newItems[index].qty * newItems[index].rate;
    setItems(newItems);
  };

  const addItem = () =>
    setItems([...items, { id: items.length + 1, particulars: "", qty: 0, rate: 0, amount: 0 }]);

  const deleteItem = (id) => setItems(items.filter((item) => item.id !== id));

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const cgst = subtotal * 0.025;
    const sgst = subtotal * 0.025;
    return { subtotal, cgst, sgst, grandTotal: subtotal + cgst + sgst };
  };

  const saveBill = () => {
    const billData = {
      invoiceNo,
      invoiceDate,
      clientName,
      clientGST,
      clientAddress,
      items,
      totals: calculateTotals(),
    };
    const savedBills = JSON.parse(localStorage.getItem("bills")) || [];
    savedBills.push(billData);
    localStorage.setItem("bills", JSON.stringify(savedBills));
    setInvoiceNo(invoiceNo + 1); // Increment invoice number for next bill
    setItems([{ id: 1, particulars: "", qty: 0, rate: 0, amount: 0 }]);
    setClientName("");
    setClientGST("");
    setClientAddress("");
    setInvoiceDate("");
    alert("Bill saved successfully!");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Sadguru Cloth Center", 10, 10);
    autoTable(doc, {
      startY: 20,
      head: [["Sr. No", "Particulars", "Qty", "Rate", "Amount"]],
      body: items.map((item) => [item.id, item.particulars, item.qty, item.rate, item.amount]),
    });
    doc.save(`invoice_${invoiceNo}.pdf`);
  };

  const { subtotal, cgst, sgst, grandTotal } = calculateTotals();

  return (
    <div className="invoice-container">
      <div className="header">
        <div className="business-info">
          <div>
            <img
              src={logo}
              alt="Business Logo"
              style={{ height: "200px", width: "800px", display: "block", margin: "0 auto" }}
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
        <label>
          To: <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} />
        </label>
        <label>
          GST No: <input type="text" value={clientGST} onChange={(e) => setClientGST(e.target.value)} />
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
          Date: <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
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
              <td>
                <input
                  type="text"
                  value={item.particulars}
                  onChange={(e) => handleItemChange(index, "particulars", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) => handleItemChange(index, "rate", e.target.value)}
                />
              </td>
              <td>{item.amount.toFixed(2)}</td>
              <td>
                <button onClick={() => deleteItem(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={addItem}>Add Item</button>
      <button onClick={saveBill}>Save Bill</button>

      <button onClick={() => navigate("/previous-bills")}>Show Previous Bills</button>

      <div className="summary-container">
        <table>
          <tr>
            <td>Subtotal:</td>
            <td>{subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td>CGST @ 2.5%:</td>
            <td>{cgst.toFixed(2)}</td>
          </tr>
          <tr>
            <td>SGST @ 2.5%:</td>
            <td>{sgst.toFixed(2)}</td>
          </tr>
          <tr>
            <td>
              <b>Grand Total:</b>
            </td>
            <td>
              <b>{grandTotal.toFixed(2)}</b>
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
