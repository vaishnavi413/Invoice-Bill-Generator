import Invoice from "../models/Invoice.js";

// Generate new invoice number
const getNextInvoiceNumber = async () => {
  const lastInvoice = await Invoice.findOne().sort({ invoiceNumber: -1 });
  return lastInvoice ? lastInvoice.invoiceNumber + 1 : 1;
};

// Create Invoice
export const createInvoice = async (req, res) => {
  try {
    const invoiceNumber = await getNextInvoiceNumber();
    const invoice = new Invoice({ ...req.body, invoiceNumber });
    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Invoices
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Invoice by Customer Name
export const getInvoiceByCustomer = async (req, res) => {
  try {
    const { name } = req.params;
    const invoices = await Invoice.find({ customerName: new RegExp(name, "i") });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate Invoice PDF (Placeholder)
export const downloadInvoicePDF = async (req, res) => {
  res.json({ message: "PDF generation will be implemented here" });
};
