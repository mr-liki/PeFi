import { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useTransactions } from "./context/TransactionContext"; // ✅ ADDED
import "./Categories.css";

export default function Categories() {
  const { transactions } = useTransactions(); // ✅ Get transactions from context

  // ✅ Default state
  const [year, setYear] = useState("2025");
  const [category, setCategory] = useState("Debt");

  // 🔹 Categories to display on right side
  const categories = [
    "Debt", "Food", "Groceries", "Health", "Housing",
    "Salary", "Savings", "Shopping", "Travel", "Others"
  ];

  // ✅ Prepare monthly expenses dynamically from transactions
  const monthlyExpenses = useMemo(() => {
    // Initialize 12 months with 0
    const months = Array(12).fill(0);

    transactions.forEach((tx) => {
      const txDate = new Date(tx.date);
      const txYear = txDate.getFullYear().toString();
      const txMonth = txDate.getMonth(); // 0 = Jan

      if (txYear === year && tx.category === category) {
        months[txMonth] += Number(tx.amount);
      }
    });

    return months;
  }, [transactions, year, category]);

  // ✅ Pie chart data
  const pieData = monthlyExpenses.map((value, idx) => ({
    name: `M${idx + 1}`,
    value: Math.abs(value), // 🔹 make values positive for pie chart
  }));

  // ✅ Line chart data (keep original signed values)
  const lineData = monthlyExpenses.map((value, idx) => ({
    name: `M${idx + 1}`,
    value,
  }));

  // Colors for pie chart
  const COLORS = [
    "#ff7675",
    "#74b9ff",
    "#55efc4",
    "#ffb703",
    "#fd79a8",
    "#636e72",
    "#fab1a0",
    "#81ecec",
    "#a29bfe",
    "#dfe6e9",
    "#00cec9",
    "#e17055",
  ];

  return (
    <div className="categories-card">
      <div className="categories-content">
        {/* LEFT SECTION (Charts) */}
        <div className="charts-section">
          <div className="top-bar">
            <h3>{category} Analysis</h3>
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>

          <div className="charts-grid">
            {/* Pie Chart */}
            <div className="chart-box">
              <h4>{category} % by Month ({year})</h4>
                <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ value, percent }) =>
                      percent > 0 ? `${(percent * 100).toFixed(1)}%` : ""
                    } // ✅ only show if > 0
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, _, __, percent) =>
                    `${(percent * 100).toFixed(1)}%`
                  }/>
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart */}
            <div className="chart-box">
              <h4>{category} Monthly Funds ({year})</h4>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={lineData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#0984e3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION (Category boxes) */}
        <div className="options-section">
          <h3>Categories</h3>
          <div className="categories-grid">
            {categories.map((cat, i) => (
              <div
                key={cat}
                className={`category-box size-${(i % 3) + 1} ${category === cat ? "active" : ""}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
