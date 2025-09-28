import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
    customerName: String,
    gstNumber: String,
    address: String,
    poNumber: String, // Added PO Number field
    invoiceNumber: Number,
    items: [
        {
            description: String,
            quantity: Number,
            rate: Number,
            amount: Number,
        },
    ],
    subtotal: Number,
    cgst: Number,
    sgst: Number,
    grandTotal: Number,
}, { timestamps: true });

const Invoice = mongoose.model("Invoice", InvoiceSchema);
export default Invoice;
