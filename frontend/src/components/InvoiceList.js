import React, { useEffect, useState } from "react";
import { fetchInvoices } from "../api/invoiceApi";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const loadInvoices = async () => {
      const data = await fetchInvoices();
      console.log("Fetched Invoices:", data);
      setInvoices(data);
    };
    loadInvoices();
  }, []);

  if (invoices.length === 0) {
    return <p>No invoices found</p>;
  }

  return (
    <div>
      <h2>Invoices</h2>
      <ul>
        {invoices.map((invoice) => (
          <li key={invoice._id}>
            {invoice.customerName} - ₹{invoice.grandTotal}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InvoiceList;
