import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import _Home from "./client/pages/_Home";
import _ManageCustomers from "./client/pages/_ManageCustomers";
import _Header from "./client/ui/_Header";
import _Footer from "./client/ui/_Footer";
import _CreateCustomer from "./client/pages/_CreateCustomer";
import _DeleteCustomer from "./client/pages/_DeleteCustomer";
import _EditCustomer from "./client/pages/_EditCustomer";
import _Import from "./client/pages/_Import";
import _Export from "./client/pages/_Export";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-zinc-800">
        {/* The Header will be shared across all pages */}
        <_Header />
        {/* Define the Routes for each page */}
        <Routes>
          <Route path="/" element={<_Home />} />
          <Route path="/managecustomers" element={<_ManageCustomers />} />
          <Route path="/createcustomer" element={<_CreateCustomer />} />
          <Route path="/deletecustomer/:cusid" element={<_DeleteCustomer/>} />
          <Route path="/editcustomer/:cusid" element={<_EditCustomer/>} />
          <Route path="/import" element= {<_Import/>} />
          <Route path="/export" element= {<_Export/>} />
        </Routes>
        <_Footer/>
      </div>
    </Router>
  );
}

export default App;
