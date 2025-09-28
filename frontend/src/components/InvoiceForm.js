import React, { useState } from "react";
import { createInvoice } from "../api/invoiceApi";

const InvoiceForm = ({ onInvoiceAdded }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    gstNumber: "",
    address: "",
    poNumber: "", // Added PO Number
    items: [],
    subtotal: 0,
    cgst: 0,
    sgst: 0,
    grandTotal: 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createInvoice(formData);
    onInvoiceAdded();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Customer Name" onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} />
      <input type="text" placeholder="GST Number" onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })} />
      <input type="text" placeholder="Address" onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
      <input type="text" placeholder="PO Number" onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })} />
      <button type="submit">Add Invoice</button>
    </form>
  );
};

export default InvoiceForm;
