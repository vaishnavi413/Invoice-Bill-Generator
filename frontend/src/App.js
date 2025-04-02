import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InvoiceGenerator from './components/InvoiceGenerator';
import PreviousBills from './components/PreviousBills';

import ViewBill from './components/ViewBill'; // Ensure you import the view bill page

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/generate-invoice" element={<InvoiceGenerator />} />
        <Route path="/previous-bills" element={<PreviousBills />} />
        <Route path="/view-bill/:invoiceNo" element={<ViewBill />} /> {/* Ensure the ViewBill component is set up */}
        <Route path="/" element={<InvoiceGenerator />} />
      </Routes>
    </Router>
  );
};

export default App;
