import "./Home.css";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";

// useTransactions hook path — matches the path you used before for TransactionProvider
import { useTransactions } from "./context/TransactionContext.jsx";

export default function Home() {
  const ctx = useTransactions ? useTransactions() : null;
  const ctxTransactions = ctx && ctx.transactions ? ctx.transactions : [];

  // ✅ just use context transactions, no fallback
  const transactions = ctxTransactions;

  // overall income/expenses/balance (all time)
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income + expenses; // expenses are negative, so this is correct

  // 1) Recent 4 transactions (assumes newest first)
  const recentTransactions = transactions.slice(0, 4);

  // 2) Determine which month to use for "recent month":
  let monthToUse = new Date().getMonth();
  let yearToUse = new Date().getFullYear();
  if (transactions.length > 0 && transactions[0].date) {
    const d = new Date(transactions[0].date);
    if (!isNaN(d)) {
      monthToUse = d.getMonth();
      yearToUse = d.getFullYear();
    }
  }

  // ✅ compute monthly income (all positive amounts)
  const monthlyIncome = transactions
    .filter((t) => {
      if (!t.date) return false;
      const d = new Date(t.date);
      return (
        !isNaN(d) &&
        d.getMonth() === monthToUse &&
        d.getFullYear() === yearToUse &&
        t.amount > 0
      );
    })
    .reduce((acc, t) => acc + t.amount, 0);

  // ✅ compute monthly savings separately (category = "Savings")
  const monthlySavings = Math.abs(
    transactions
      .filter((t) => {
        if (!t.date) return false;
        const d = new Date(t.date);
        return (
          !isNaN(d) &&
          d.getMonth() === monthToUse &&
          d.getFullYear() === yearToUse &&
          t.category.toLowerCase() === "savings"
        );
      })
      .reduce((acc, t) => acc + t.amount, 0)
  );

  // ✅ compute monthly expenses (exclude savings)
  const monthlyExpenses = Math.abs(
    transactions
      .filter((t) => {
        if (!t.date) return false;
        const d = new Date(t.date);
        return (
          !isNaN(d) &&
          d.getMonth() === monthToUse &&
          d.getFullYear() === yearToUse &&
          t.amount < 0 &&
          t.category.toLowerCase() !== "savings"
        );
      })
      .reduce((acc, t) => acc + t.amount, 0)
  );

  // ✅ Final pie data (Income, Expenses, Savings)
  const pieData = [
    { name: "Income", value: monthlyIncome },
    { name: "Expenses", value: monthlyExpenses },
    { name: "Savings", value: monthlySavings }
  ];

  const COLORS = ["#00b894", "#e74c3c", "#0984e3"]; // green, red, blue

  return (
    <div className="dashboard-card">
      <div className="dashboard-content">
        {/* LEFT SECTION */}
        <div className="left-section">
          <div className="summary-cards">
            <div className="small-card balance animate">
              <div className="card-text">
                <h4>Balance</h4>
                <p>₹{balance}</p>
              </div>
            </div>
            <div className="small-card income animate">
              <div className="card-text">
                <h4>Income</h4>
                <p>₹{income}</p>
              </div>
            </div>
            <div className="small-card expense animate">
              <div className="card-text">
                <h4>Expenses</h4>
                <p>₹{Math.abs(expenses)}</p>
              </div>
            </div>
          </div>

          <div className="transactions">
            <h3>Recent Transactions</h3>
            <ul>
              {recentTransactions.map((t) => (
                <li key={t.id} className={t.type}>
                  <span>{t.category}</span>
                  <span>
                    {t.type === "income" ? "+" : "-"}₹{Math.abs(t.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="right-section">
          <h3>Summary (Recent Month)</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
