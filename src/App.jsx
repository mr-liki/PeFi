import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";   // global + navbar styles


// Pages
import Home from "./Home.jsx"; 
import AddTransaction from "./AddTransaction.jsx";
import Savings from "./Savings.jsx";
import Categories from "./Categories.jsx";

// Context
import { TransactionProvider } from "./context/TransactionContext.jsx";

export default function App() {
  return (
    <TransactionProvider>
      <Router>
        <div className="app">
          {/* Navbar */}
          <nav className="navbar">
            <div className="nav-logo"> PeFi</div>
            <ul className="nav-links">
              <li><Link to="/PeFi/">Dashboard</Link></li>
              <li><Link to="/add">Add Transaction</Link></li>
              <li><Link to="/categories">Categories</Link></li> 
              <li><Link to="/savings">Savings</Link></li>
            </ul>
          </nav>

          {/* Page Content */}
          <main className="main-content">
            <Routes>
              <Route path="/PeFi/" element={<Home />} />
              <Route path="/add" element={<AddTransaction />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/savings" element={<Savings />} />
            </Routes>
          </main>
        </div>
      </Router>
    </TransactionProvider>
  );
}
