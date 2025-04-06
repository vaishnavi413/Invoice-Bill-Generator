import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import pdf from "html-pdf";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Invoice from "./models/Invoice.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Auto-incrementing Invoice Number
async function getNextInvoiceNumber() {
  const lastInvoice = await Invoice.findOne().sort({ invoiceNumber: -1 });
  return lastInvoice ? lastInvoice.invoiceNumber + 1 : 1;
}

// ========== FILE STORAGE SETUP ==========
// Setup __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "invoice-data");
const DATA_FILE = path.join(DATA_DIR, "invoices.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let fileInvoices = [];
if (fs.existsSync(DATA_FILE)) {
  fileInvoices = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

const saveData = () => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(fileInvoices, null, 2));
};

// ========== ROUTES ==========

// Root
app.get("/", (req, res) => {
  res.send("Invoice API is running...");
});

// MongoDB Routes

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

app.get("/api/invoices", async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: "Error fetching invoices" });
  }
});

app.put("/api/invoices/:id", async (req, res) => {
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedInvoice);
  } catch (error) {
    res.status(500).json({ error: "Error updating invoice" });
  }
});

app.delete("/api/invoices/:id", async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ message: "Invoice deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting invoice" });
  }
});

app.get("/api/invoices/:id/pdf", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    const htmlTemplate = `
      <h1>Invoice</h1>
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

// File-based routes

app.post("/add-invoice", (req, res) => {
  const invoice = req.body;
  fileInvoices.push(invoice);
  saveData();
  res.status(201).send({ message: "Invoice saved successfully (file)!", invoice });
});

app.get("/invoices", (req, res) => {
  res.json(fileInvoices);
});

app.delete("/clear-old-invoices", (req, res) => {
  fileInvoices = fileInvoices.slice(-1000); // Keep last 1000 invoices
  saveData();
  res.send({ message: "Old invoices cleared!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Invoice API running on port ${PORT}`);
});
