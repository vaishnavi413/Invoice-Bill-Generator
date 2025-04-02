const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Invoice = require("./models/Invoice"); // Invoice Model
const pdf = require("html-pdf");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

mongoose.connect("mongodb://127.0.0.1:27017/invoiceDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Auto-increment invoice number
async function getNextInvoiceNumber() {
  const lastInvoice = await Invoice.findOne().sort({ invoiceNumber: -1 });
  return lastInvoice ? lastInvoice.invoiceNumber + 1 : 1;
}

// Create Invoice
app.post("/api/invoices", async (req, res) => {
  try {
    const invoiceNumber = await getNextInvoiceNumber();
    const newInvoice = new Invoice({ ...req.body, invoiceNumber });
    await newInvoice.save();
    res.status(201).json(newInvoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Invoices
app.get("/api/invoices", async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit Invoice
app.put("/api/invoices/:id", async (req, res) => {
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedInvoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Invoice
app.delete("/api/invoices/:id", async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ message: "Invoice deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Download Invoice as PDF
app.get("/api/invoices/download/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    const htmlContent = `<h1>Invoice #${invoice.invoiceNumber}</h1>
    <p>Customer: ${invoice.customerName}</p>
    <p>Total: ₹${invoice.grandTotal}</p>`;
    
    pdf.create(htmlContent).toBuffer((err, buffer) => {
      if (err) return res.status(500).json({ error: err.message });
      res.contentType("application/pdf").send(buffer);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
