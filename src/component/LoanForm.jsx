import { useState, useEffect } from "react";
import "./LoanForm.scss";

const LoanForm = ({ handleCalculate, handleReset, onInputChange }) => {
  const [amount, setAmount] = useState("");
  const [extraPrinciple, setExtraPrinciple] = useState("");
  const [fromMonth, setFromMonth] = useState("");

  const formatIndianRupee = (value) => {
    const number = Number(value.replace(/,/g, ""));
    if (isNaN(number)) return "";
    return new Intl.NumberFormat("en-IN").format(number);
  };

  const handleAmountChange = (e) => {
    const raw = e.target.value.replace(/,/g, "");
    if (!isNaN(raw)) {
      setAmount(formatIndianRupee(raw));
      onInputChange();
    }
  };

  const handleExtraChange = (e) => {
    const raw = e.target.value.replace(/,/g, "");
    if (!isNaN(raw)) {
      setExtraPrinciple(formatIndianRupee(raw));
      onInputChange();
    }
  };

  const handleFromMonthChange = (e) => {
    setFromMonth(e.target.value);
    onInputChange();
  };

  useEffect(() => {
    if (extraPrinciple && !fromMonth) {
      setFromMonth("1");
    } else if (!extraPrinciple) {
      setFromMonth("");
    }
  }, [extraPrinciple]);

  const onCalculate = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.set("amount", amount.replace(/,/g, ""));
    formData.set("extraPrinciple", extraPrinciple.replace(/,/g, ""));
    formData.set("fromMonth", fromMonth || "");

    const customEvent = {
      ...e,
      target: {
        ...e.target,
        amount: { value: formData.get("amount") },
        extraPrinciple: { value: formData.get("extraPrinciple") },
        interestRate: { value: formData.get("interestRate") },
        tenure: { value: formData.get("tenure") },
        fromMonth: { value: formData.get("fromMonth") },
      },
    };

    handleCalculate(customEvent);
  };

  const onReset = () => {
    setAmount("");
    setExtraPrinciple("");
    setFromMonth("");
    handleReset();
  };

  return (
    <form className="section_two" onSubmit={onCalculate}>
      <div className="input-group">
        <label>Loan Amount</label>
        <input
          type="text"
          placeholder="Enter amount"
          name="amount"
          required
          value={amount}
          onChange={handleAmountChange}
        />
      </div>

      <div className="input-group">
        <label>Interest Rate (%)</label>
        <input
          type="number"
          placeholder="Enter interest rate"
          step={0.01}
          name="interestRate"
          required
          onChange={onInputChange}
        />
      </div>

      <div className="input-group">
        <label>Loan Tenure (Years)</label>
        <input
          type="number"
          placeholder="Enter loan tenure"
          name="tenure"
          required
          min={1}
          onChange={onInputChange}
        />
      </div>

      <div className="input-group">
        <label>Extra Principal (Optional)</label>
        <input
          type="text"
          placeholder="Enter extra principal amount"
          name="extraPrinciple"
          value={extraPrinciple}
          onChange={handleExtraChange}
        />
      </div>

      {extraPrinciple && (
        <div className="input-group">
          <label>Start Extra Principal From Month (Optional)</label>
          <input
            type="number"
            placeholder="Enter starting month for extra principal"
            name="fromMonth"
            min={1}
            value={fromMonth}
            onChange={handleFromMonthChange}
          />
        </div>
      )}

      <div className="button_section">
        <button type="reset" className="button reset" onClick={onReset}>
          Reset
        </button>
        <button type="submit" className="button success">
          Calculate
        </button>
      </div>
    </form>
  );
};

export default LoanForm;
