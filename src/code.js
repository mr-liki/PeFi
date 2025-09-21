import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");

  // Load from LocalStorage
  useEffect(() => {
    const data = localStorage.getItem("transactions");
    if (data) {
      setTransactions(JSON.parse(data));
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (e) => {
    e.preventDefault();
    if (!text || !amount) return;

    const newTransaction = {
      id: Date.now(),
      text,
      amount: +amount,
    };

    setTransactions([...transactions, newTransaction]);
    setText("");
    setAmount("");
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const clearAll = () => {
    setTransactions([]);
    localStorage.removeItem("transactions");
  };

  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income + expense;

  return (
    <div className="app">
      <h2>Expense Tracker</h2>

      {/* Balance */}
      <div className="balance">
        <h3>Balance</h3>
        <p>${balance.toFixed(2)}</p>
      </div>

      {/* Income & Expense summary */}
      <div className="summary">
        <div>
          <h4>Income</h4>
          <p className="plus">+${income.toFixed(2)}</p>
        </div>
        <div>
          <h4>Expense</h4>
          <p className="minus">${expense.toFixed(2)}</p>
        </div>
      </div>

      {/* History */}
      <div className="history-header">
        <h3>History</h3>
        {transactions.length > 0 && (
          <button className="clear-btn" onClick={clearAll}>Clear All</button>
        )}
      </div>
      <ul className="list">
        {transactions.map((t) => (
          <li key={t.id} className={t.amount < 0 ? "minus" : "plus"}>
            {t.text} <span>{t.amount < 0 ? "-" : "+"}${Math.abs(t.amount)}</span>
            <button onClick={() => deleteTransaction(t.id)} className="delete-btn">x</button>
          </li>
        ))}
      </ul>

      {/* Add Transaction */}
      <h3>Add new transaction</h3>
      <form onSubmit={addTransaction}>
        <div className="form-control">
          <label>Text</label>
          <input
            type="text"
            placeholder="Enter description..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label>
            Amount <br />
            (negative = expense, positive = income)
          </label>
          <input
            type="number"
            placeholder="Enter amount..."
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <button className="btn">Add transaction</button>
      </form>
    </div>
  );
}

export default App;
