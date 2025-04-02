import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PreviousBills = () => {
  const [previousBills, setPreviousBills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedBills = JSON.parse(localStorage.getItem("bills")) || [];
    setPreviousBills(savedBills);
  }, []);

  // Navigate to view bill details
  const viewBill = (bill) => {
    navigate(`/view-bill/${bill.invoiceNo}`, { state: { bill } });
  };

  // Delete a bill from local storage
  const deleteBill = (invoiceNo) => {
    const updatedBills = previousBills.filter((bill) => bill.invoiceNo !== invoiceNo);
    setPreviousBills(updatedBills);
    localStorage.setItem("bills", JSON.stringify(updatedBills));
  };

  return (
    <div className="previous-bills">
      <h2>Previous Bills</h2>
      {previousBills.length === 0 ? (
        <p>No previous bills available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Client</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {previousBills.map((bill) => (
              <tr key={bill.invoiceNo}>
                <td>{bill.invoiceNo}</td>
                <td>{bill.clientName}</td>
                <td>{bill.invoiceDate}</td>
                <td>
                  <button onClick={() => viewBill(bill)}>View</button>
                  <button onClick={() => deleteBill(bill.invoiceNo)}>Delete</button> {/* Only Delete button */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PreviousBills;
