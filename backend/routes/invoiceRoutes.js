import express from "express";
import {
  createInvoice,
  getInvoices,
  getInvoiceByCustomer,
  downloadInvoicePDF,
} from "../controllers/invoiceController.js";

const router = express.Router();

router.post("/", createInvoice);
router.get("/", getInvoices);
router.get("/search/:name", getInvoiceByCustomer);
router.get("/download/:id", downloadInvoicePDF);

export default router;
