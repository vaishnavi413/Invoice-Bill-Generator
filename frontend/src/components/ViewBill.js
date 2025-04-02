import React from "react";
import { useLocation } from "react-router-dom";

const ViewBill = () => {
  const { state } = useLocation();
  const { bill } = state || {};

  if (!bill) {
    return <p>No bill data found.</p>;
  }

  return (
    <div>
      <h2>Invoice No: {bill.invoiceNo}</h2>
      <p>Date: {bill.invoiceDate}</p>
      <p>Client: {bill.clientName}</p>
      <p>GST No: {bill.clientGST}</p>
      <p>Address: {bill.clientAddress}</p>

      <table>
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>Particulars</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {bill.items.map((item, index) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.particulars}</td>
              <td>{item.qty}</td>
              <td>{item.rate}</td>
              <td>{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>Subtotal: {bill.totals.subtotal}</p>
      <p>CGST: {bill.totals.cgst}</p>
      <p>SGST: {bill.totals.sgst}</p>
      <p><strong>Grand Total: {bill.totals.grandTotal}</strong></p>
    </div>
  );
};

export default ViewBill;
