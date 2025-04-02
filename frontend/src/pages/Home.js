import React, { useState } from "react";
import InvoiceForm from "../components/InvoiceForm";
import InvoiceList from "../components/InvoiceList";

const Home = () => {
  const [reload, setReload] = useState(false);

  return (
    <div>
      <h1>Invoice Generator</h1>
      <InvoiceForm onInvoiceAdded={() => setReload(!reload)} />
      <InvoiceList key={reload} />
    </div>
  );
};

export default Home;
