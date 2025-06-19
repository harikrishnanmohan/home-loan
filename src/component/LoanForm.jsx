import "./LoanForm.scss";

const LoanForm = ({ handleCalculate, handleReset }) => {
  const onCalculate = (e) => {
    handleCalculate(e);
  };
  const onReset = () => {
    handleReset();
  };
  return (
    <form className="section_two" onSubmit={onCalculate}>
      <div className="input-group">
        <label>Loan Amount</label>
        <input
          type="number"
          placeholder="Enter amount"
          name="amount"
          required
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
        />
      </div>

      <div className="input-group">
        <label>Loan Tenure (Years)</label>
        <input
          type="number"
          placeholder="Enter loan tenure"
          name="tenure"
          required
        />
      </div>

      <div className="input-group">
        <label>Extra Principal (Optional)</label>
        <input
          type="number"
          placeholder="Enter extra principal amount"
          name="extraPrinciple"
        />
      </div>

      <div className="input-group">
        <label>Start Extra Principal From Month (Optional)</label>
        <input
          type="number"
          placeholder="Enter starting month for extra principal"
          name="fromMonth"
          min={1}
        />
      </div>

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
