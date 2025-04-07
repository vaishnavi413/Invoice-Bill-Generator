# 🧾 Invoice Generator (MERN Stack)

An end-to-end **Invoice Generator** web application built with **Node.js**, **Express**, **MongoDB**, and **React** (frontend to be added). It allows you to create, store, manage, and generate downloadable PDF invoices.

## 🔧 Features

- Create and auto-save new invoices
- Auto-incrementing invoice numbers
- Fetch all invoices
- Update or delete existing invoices
- Generate and download PDF of individual invoices
- Local file-based storage for offline mode (JSON)
- Auto-clear old invoices from local storage if storage is full

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (Online Mode), File System (Offline Mode)
- **PDF Generation**: html-pdf
- **Environment Management**: dotenv
- **CORS Enabled** for API testing
- **Language**: JavaScript (ES6+)

## 📁 Project Structure

. ├── models/ │ └── Invoice.js ├── .env ├── server.js ├── package.json └── README.md

## 🧪 API Endpoints

### 🌐 Online Mode (MongoDB)

- `GET /` – Welcome message
- `POST /api/invoices` – Create a new invoice
- `GET /api/invoices` – Get all invoices
- `PUT /api/invoices/:id` – Update invoice by ID
- `DELETE /api/invoices/:id` – Delete invoice by ID
- `GET /api/invoices/:id/pdf` – Download invoice as PDF

### 💾 Offline Mode (Local Storage)

- `POST /add-invoice` – Save invoice to local file
- `GET /invoices` – Get all local invoices
- `DELETE /clear-old-invoices` – Keep only latest 1000 invoices

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/invoice-generator.git
cd invoice-generator

2. Install dependencies
npm install

3. Create .env file
PORT=8080
MONGO_URI=your_mongodb_connection_string

4. Run the server
npm start
Server will run at http://localhost:8080

🧾 Sample Invoice Format
{
  "customerName": "John Doe",
  "gstNumber": "29ABCDE1234F2Z5",
  "items": [
    { "description": "Product A", "quantity": 2, "price": 150 },
    { "description": "Product B", "quantity": 1, "price": 300 }
  ],
  "grandTotal": 600
}

📝 To-Do
 React frontend integration

 User authentication (JWT)

 Dashboard and analytics

 Email invoice PDFs

 Export to Excel

👩‍💻 Author
Vaishnavi Taware
B.C.A. | Data Science & Analytics | MERN Stack Developer 
LinkedIn | GitHub
!(https://github.com/user-attachments/assets/d0428d8d-a3b2-4b93-8173-7fd95b2d06a8)


