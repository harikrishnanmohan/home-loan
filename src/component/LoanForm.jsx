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
      <input type="number" placeholder="Amount" name="amount" required />
      <input
        type="number"
        placeholder="Interest Rate"
        step={0.01}
        name="interestRate"
        required
      />
      <input type="number" placeholder="Tenure" name="tenure" required />
      <input
        type="number"
        placeholder="Extra Principle (optional)"
        name="extraPrinciple"
      />
      <input
        type="number"
        placeholder="From Month (if entering extra principle)"
        name="fromMonth"
        min={7}
      />
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
