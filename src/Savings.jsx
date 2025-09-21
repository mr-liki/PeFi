import { useState, useEffect } from "react";
import { useTransactions } from "./context/TransactionContext"; // ✅ ADDED
import "./Savings.css";

export default function Savings() {
  const { savingsGoal, setSavingsGoal } = useTransactions(); // ✅ use context

  const [formData, setFormData] = useState({
    goalName: "",
    targetAmount: "",
    duration: "",
    option: "daily",
  });

  const [estimated, setEstimated] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [marked, setMarked] = useState({});
  const [formSlide, setFormSlide] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // ✅ Load saved goal from context when page mounts
  useEffect(() => {
    if (savingsGoal) {
      setFormData(savingsGoal.formData);
      setEstimated(savingsGoal.estimated);
      setConfirmed(true);
      setFormSlide(true);
      setMarked(savingsGoal.marked || {});
      setIsCompleted(savingsGoal.isCompleted || false);
    }
  }, [savingsGoal]);

  // Quotes list
  const quotes = [
    "Do not save what is left after spending, but spend what is left after saving. – Warren Buffett",
    "A penny saved is a penny earned. – Benjamin Franklin",
    "Saving must become a priority, not just a thought. Pay yourself first. – Dave Ramsey",
    "Beware of little expenses; a small leak will sink a great ship. – Benjamin Franklin",
    "Do not save money, save yourself first, then your money will save you. – Mokokoma Mokhonoana",
    "The habit of saving is itself an education; it fosters every virtue, teaches self-denial, cultivates the sense of order, trains to forethought, and so broadens the mind. – T.T. Munger",
    "It is not your salary that makes you rich, it’s your spending habits. – Charles A. Jaffe",
    "A man who both spends and saves money is the happiest man, because he has both enjoyments. – Samuel Johnson",
    "The art is not in making money, but in keeping it. – Proverb",
    "Try to save something while your salary is small; it’s impossible to save after you begin to earn more. – Jack Benny",
  ];
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Cycle quotes every 10 seconds
  useEffect(() => {
    if (confirmed && formSlide) {
      const interval = setInterval(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [confirmed, formSlide]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateEstimate = (e) => {
    e.preventDefault();
    const { targetAmount, duration, option } = formData;
    if (!targetAmount || !duration) return;

    let periods = 0;
    if (option === "daily") periods = duration * 30;
    if (option === "weekly") periods = duration * 4;
    if (option === "monthly") periods = duration;

    const perPeriod = (parseFloat(targetAmount) / periods).toFixed(2);
    setEstimated({ perPeriod, periods });
    setConfirmed(false);
    setMarked({});
    setIsCompleted(false);
  };

  const handleConfirm = () => {
    setFormSlide(true);
    setConfirmed(true);

    // ✅ Save goal to context
    setSavingsGoal({
      formData,
      estimated,
      marked,
      isCompleted,
    });
  };

  const toggleMark = (i) => {
    const newMarked = {
      ...marked,
      [i]: marked[i] === true ? false : marked[i] === false ? null : true,
    };
    setMarked(newMarked);

    // ✅ Update context each time you mark progress
    setSavingsGoal({
      formData,
      estimated,
      marked: newMarked,
      isCompleted,
    });
  };

  const progress = estimated
    ? (Object.values(marked).filter((v) => v === true).length /
        estimated.periods) *
      100
    : 0;

  // Detect when goal is completed
  useEffect(() => {
    if (progress === 100) {
      setIsCompleted(true);
      setSavingsGoal({
        formData,
        estimated,
        marked,
        isCompleted: true,
      });
    }
  }, [progress]);

  const getLabels = () => {
    if (!estimated) return [];
    if (formData.option === "daily")
      return Array.from({ length: estimated.periods }, (_, i) => `Day ${i + 1}`);
    if (formData.option === "weekly")
      return Array.from({ length: estimated.periods }, (_, i) => `Week ${i + 1}`);
    if (formData.option === "monthly")
      return Array.from({ length: estimated.periods }, (_, i) => `Month ${i + 1}`);
    return [];
  };

  const handleReset = () => {
    setFormData({
      goalName: "",
      targetAmount: "",
      duration: "",
      option: "daily",
    });
    setFormSlide(false);
    setEstimated(null);
    setConfirmed(false);
    setMarked({});
    setCurrentQuoteIndex(0);
    setIsCompleted(false);

    // ✅ Clear context
    setSavingsGoal(null);
  };

  return (
    <div className="savings-card">
      <div className={`savings-content ${formSlide ? "form-left" : "center-form"}`}>
        {/* LEFT Section */}
        <div className={`form-section ${formSlide ? "slide-left" : ""}`}>
          <form onSubmit={calculateEstimate}>
            {!estimated && (
              <>
                <h3>Add a New Goal</h3>
                <label>Goal Name</label>
                <input
                  type="text"
                  name="goalName"
                  value={formData.goalName}
                  onChange={handleChange}
                />

                <label>Target Amount (₹)</label>
                <input
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleChange}
                />

                <label>Duration (Months)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                />

                <label>Option</label>
                <select name="option" value={formData.option} onChange={handleChange}>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>

                <button type="submit">Calculate</button>
              </>
            )}

            {estimated && !confirmed && (
              <div className="estimated-form">
                <p className="estimated-text">
                  Estimated Saving per {formData.option}: ₹{estimated.perPeriod}
                </p>
                <button type="button" className="confirm-btn" onClick={handleConfirm}>
                  Confirm Plan
                </button>
              </div>
            )}

            {/* After confirmation: show quotes + buttons */}
            {confirmed && formSlide && (
              <div className="Afterconfirm">
                <div className="quote-section">{quotes[currentQuoteIndex]}</div>
                <div className="bottom-buttons">
                  <button type="button" className="reset-btn" onClick={handleReset}>
                    Reset
                  </button>
                  <button
                    type="button"
                    className={`complete-btn ${isCompleted ? "active" : ""}`}
                    onClick={isCompleted ? handleReset : null}
                    disabled={!isCompleted}
                  >
                    Completed
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* RIGHT Section */}
        {formSlide && confirmed && (
          <div className="display-section">
            <div className="goal-info">
              <span className="goal-text">Goal: {formData.goalName}</span>
              <span className="save-text">
                To Save: ₹{estimated.perPeriod} {formData.option}
              </span>
            </div>

            <div className="progress-container">
              <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="savings-grid scrollable">
              {getLabels().map((label, i) => (
                <div
                  key={i}
                  onClick={() => toggleMark(i)}
                  className={`savings-box ${
                    marked[i] === true ? "saved" : marked[i] === false ? "missed" : ""
                  }`}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
