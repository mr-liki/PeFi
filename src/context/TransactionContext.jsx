import { createContext, useContext, useState, useEffect } from "react";

// Create context
const TransactionContext = createContext();

// Provider component
export const TransactionProvider = ({ children }) => {
  // ✅ Load transactions from localStorage OR start empty
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ Added savings goal state (also persisted)
  const [savingsGoal, setSavingsGoal] = useState(() => {
    const savedGoal = localStorage.getItem("savingsGoal");
    return savedGoal ? JSON.parse(savedGoal) : null;
  });

  // ✅ Save transactions to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // ✅ Save savingsGoal to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem("savingsGoal", JSON.stringify(savingsGoal));
  }, [savingsGoal]);

  // Function to add a transaction
  const addTransaction = (transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
  };

  return (
    <TransactionContext.Provider
      value={{ transactions, addTransaction, savingsGoal, setSavingsGoal }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

// Custom hook for using the context
export const useTransactions = () => useContext(TransactionContext);
