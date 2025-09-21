import { useState } from "react";
import "./AddTransaction.css";
import { useTransactions } from "./context/TransactionContext";  // ✅ import context

export default function AddTransaction() {
  const { transactions, addTransaction } = useTransactions(); // ✅ use global context
  const [formData, setFormData] = useState({
    date: "",
    category: "",
    amount: "",
  });

  // 🔹 Filter state
  const [filter, setFilter] = useState({ from: "", to: "" });
  const [filteredTransactions, setFilteredTransactions] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let amountNum = parseFloat(formData.amount);
    if (!formData.date || !formData.category || isNaN(amountNum)) return;

    // ✅ Default sign handling
    if (formData.category === "Salary") {
      amountNum = Math.abs(amountNum); // force positive
    } else {
      amountNum = -Math.abs(amountNum); // force negative
    }

    const newTransaction = {
      id: Date.now(),
      date: formData.date,
      category: formData.category,
      amount: amountNum,
    };

    addTransaction(newTransaction); // ✅ push to global context

    // reset form
    setFormData({ date: "", category: "", amount: "" });
  };

  // 🔹 Filter Submit
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    if (!filter.from || !filter.to) return;

    const filtered = transactions.filter((t) => {
      const txDate = new Date(t.date);
      return (
        txDate >= new Date(filter.from) && txDate <= new Date(filter.to)
      );
    });
    setFilteredTransactions(filtered);
  };

  // 🔹 Clear filter
  const clearFilter = () => {
    setFilter({ from: "", to: "" });
    setFilteredTransactions(null);
  };

  // 🔹 Use filtered or all
  const displayTransactions = filteredTransactions ?? transactions;

  // ✅ Step 1: sort ascending (oldest first)
  const ascending = [...displayTransactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // ✅ Step 2: compute balances in order
  let runningBalance = 0;
  const withBalances = ascending.map((t) => {
    runningBalance += t.amount;
    return { ...t, balance: runningBalance };
  });

  // ✅ Step 3: choose order for display
  const finalTransactions = filteredTransactions
    ? withBalances // ascending when filtered
    : [...withBalances].reverse(); // descending otherwise

  return (
    <div className="add-transaction-card">
      <div className="add-transaction-content">
        {/* LEFT SECTION → FORMS */}
        <div className="form-section">
          <h3>Add New Transaction</h3>
          <form onSubmit={handleSubmit}>
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />

            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Debt">Debt</option>
              <option value="Food">Food</option>
              <option value="Groceries">Groceries</option>
              <option value="Health">Health</option>
              <option value="Housing">Housing</option>
              <option value="Salary">Salary</option>
              <option value="Savings">Savings</option>
              <option value="Shopping">Shopping</option>
              <option value="Travel">Travel</option>
              <option value="Others">Others</option>
            </select>

            <label>Amount</label>
            <input
              type="number"
              name="amount"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={handleChange}
            />

            <button type="submit">Add Transaction</button>
          </form>

          {/* 🔹 Show Transaction Filter Form */}
          <div className="filter-section">
            <h3>Show Transactions</h3>
            <form onSubmit={handleFilterSubmit}>
              <label>From</label>
              <input
                type="date"
                name="from"
                value={filter.from}
                onChange={(e) =>
                  setFilter({ ...filter, from: e.target.value })
                }
              />

              <label>To</label>
              <input
                type="date"
                name="to"
                value={filter.to}
                onChange={(e) =>
                  setFilter({ ...filter, to: e.target.value })
                }
              />
              <div className="formbutton">
                <button type="submit">Show</button>
                <button type="button" onClick={clearFilter} className="clear-btn">
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT SECTION → TRANSACTIONS TABLE */}
        <div className="table-section">
          <h3>Transactions</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {finalTransactions.length > 0 ? (
                  finalTransactions.map((t) => (
                    <tr
                      key={t.id}
                      className={t.amount > 0 ? "income-row" : "expense-row"}
                    >
                      <td>{t.date}</td>
                      <td>{t.category}</td>
                      <td>
                        {t.amount > 0 ? `+₹${t.amount}` : `-₹${Math.abs(t.amount)}`}
                      </td>
                      <td>₹{t.balance}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
