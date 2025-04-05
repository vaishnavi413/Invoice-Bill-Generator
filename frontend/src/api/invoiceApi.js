import axios from "axios";

const API_URL = "https://invoice-bill-generator-backend.onrender.com
"; // Backend API URL

export const fetchInvoices = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log("Fetched Invoices:", response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
};

export const createInvoice = async (invoiceData) => {
  try {
    const response = await axios.post(API_URL, invoiceData);
    return response.data;
  } catch (error) {
    console.error("Error creating invoice:", error);
  }
};
