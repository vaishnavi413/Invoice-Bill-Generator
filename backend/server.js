import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import pdf from "html-pdf";
import fs from "fs";
import Invoice from "./models/Invoice.js"; // Ensure Invoice model uses ES Module

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/invoiceDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Auto-incrementing Invoice Number
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
    } catch (error) {
        res.status(500).json({ error: "Error creating invoice" });
    }
});

// Get All Invoices
app.get("/api/invoices", async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ error: "Error fetching invoices" });
    }
});

// Update Invoice
app.put("/api/invoices/:id", async (req, res) => {
    try {
        const updatedInvoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedInvoice);
    } catch (error) {
        res.status(500).json({ error: "Error updating invoice" });
    }
});

// Delete Invoice
app.delete("/api/invoices/:id", async (req, res) => {
    try {
        await Invoice.findByIdAndDelete(req.params.id);
        res.json({ message: "Invoice deleted" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting invoice" });
    }
});

// Generate Invoice PDF
app.get("/api/invoices/:id/pdf", async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) return res.status(404).json({ error: "Invoice not found" });

        const htmlTemplate = `<h1>Invoice</h1>
            <p>Customer: ${invoice.customerName}</p>
            <p>GST: ${invoice.gstNumber}</p>
            <p>Total: ₹${invoice.grandTotal}</p>`;

        pdf.create(htmlTemplate).toStream((err, stream) => {
            if (err) return res.status(500).json({ error: "Error generating PDF" });
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");
            stream.pipe(res);
        });
    } catch (error) {
        res.status(500).json({ error: "Error generating PDF" });
    }
});

// Start Server
app.listen(PORT, () => console.log(`Invoice API running on port ${PORT}`));


app.get("/", (req, res) => {
  res.send("Invoice API is running...");
});
