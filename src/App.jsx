import { useState } from "react";

import EmiTable from "./component/EmiTable";
import LoanTable from "./component/LoanTable";
import LoanForm from "./component/LoanForm";
import { toIndianCurrency } from "./util";

import "./App.scss";

function App() {
  const [emi, setEmi] = useState([]);
  const [loanInfo, setLoanInfo] = useState({});

  const calculateEmiDetails = (
    loanAmount,
    interestRateByMonth,
    monthlyEmi,
    extraPrinciple,
    fromMonth
  ) => {
    let tempMonthlyEmi = monthlyEmi;
    let tempLoanAmount = loanAmount;
    let tempArray = [];
    let month = 1;
    let totalAmountPaid = 0;
    let totalExtraPrinciple = 0;

    while (tempLoanAmount > 0) {
      let interestShare = Math.round(tempLoanAmount * interestRateByMonth);
      let loanShare = tempMonthlyEmi - interestShare;

      if (tempLoanAmount < tempMonthlyEmi) {
        tempMonthlyEmi = tempLoanAmount + interestShare;
        loanShare = tempLoanAmount;
        tempLoanAmount = 0;
      } else {
        tempLoanAmount -= loanShare;

        if (fromMonth && month >= fromMonth) {
          tempLoanAmount -= extraPrinciple;
          totalExtraPrinciple += extraPrinciple;
        }
      }

      totalAmountPaid += tempMonthlyEmi;

      tempArray.push({
        month,
        monthlyEmi: tempMonthlyEmi,
        loanShare,
        interestShare,
        loanBalance: tempLoanAmount,
        extraPrinciple:
          month >= fromMonth && fromMonth && tempLoanAmount > extraPrinciple
            ? extraPrinciple
            : 0,
      });

      month++;
    }

    return { tempArray, totalAmountPaid, totalExtraPrinciple, month };
  };

  const handleCalculate = (e) => {
    const data = new FormData(e.currentTarget);
    const loanAmount = data.get("amount").replace(/,/g, "");
    const interestRate = data.get("interestRate");
    const tenure = data.get("tenure");
    const extraPrinciple = +data.get("extraPrinciple").replace(/,/g, "") || 0;
    const fromMonth = +data.get("fromMonth") || 0;

    const interestRateByMonth = interestRate / 12 / 100;
    const tenureByMonth = tenure * 12;

    const monthlyEmi = Math.round(
      (loanAmount *
        interestRateByMonth *
        Math.pow(1 + interestRateByMonth, tenureByMonth)) /
        (Math.pow(1 + interestRateByMonth, tenureByMonth) - 1)
    );

    const { tempArray, totalAmountPaid, totalExtraPrinciple, month } =
      calculateEmiDetails(
        loanAmount,
        interestRateByMonth,
        monthlyEmi,
        extraPrinciple,
        fromMonth
      );

    const {
      tempArray: tempArray2,
      totalAmountPaid: totalAmountPaid2,
      month: month2,
    } = calculateEmiDetails(loanAmount, interestRateByMonth, monthlyEmi, 0, 0);

    setEmi(tempArray);

    setLoanInfo({
      Emi: toIndianCurrency(monthlyEmi),
      Month: `${month - 1} (${Math.floor((month - 1) / 12)}.${
        (month - 1) % 12
      } Year)`,
      "Loan amount": toIndianCurrency(+loanAmount),
      "Total interest paid": toIndianCurrency(totalAmountPaid - loanAmount),
      "Total amount paid": toIndianCurrency(totalAmountPaid),
      "Extra principle paid monthly": toIndianCurrency(extraPrinciple),
      "Total principle paid extra": toIndianCurrency(
        month === month2 ? 0 : totalExtraPrinciple
      ),
      "Total amount- If extra principle paid": toIndianCurrency(
        totalAmountPaid + totalExtraPrinciple === totalAmountPaid
          ? 0
          : totalAmountPaid + totalExtraPrinciple
      ),
      "Total amount to be paid - If no extra principle paid": toIndianCurrency(
        month === month2 ? 0 : totalAmountPaid2
      ),
      "Number of months - If no extra principle paid":
        month === month2
          ? 0
          : `${month2 - 1} (${Math.floor((month2 - 1) / 12)}.${
              (month2 - 1) % 12
            } Year)`,
      "Amount saved": toIndianCurrency(
        totalAmountPaid2 -
          totalAmountPaid -
          extraPrinciple * (month - 1 - fromMonth)
      ),
      "Months saved":
        month === month2
          ? 0
          : `${month2 - 1 - (month - 1)} (${Math.floor(
              (month2 - 1 - (month - 1)) / 12
            )}.${(month2 - 1 - (month - 1)) % 12} Years)`,
    });
  };

  const handleReset = () => {
    setEmi([]);
    setLoanInfo({});
  };

  const handleInputChange = () => {
    setEmi([]);
    setLoanInfo({});
  };

  return (
    <div className="app">
      <h1 className="title">Home Loan</h1>
      <div className="input_section">
        <div className="section_one">
          <p>Plan Smart,</p>
          <p>Borrow Wisely</p>
          <p>B– Your Home Loan,</p>
          <p>Calculated!</p>
          <p className="section_one_small">
            Plan Smart, Borrow Wisely, B– Your Home Loan, Calculated!
          </p>
        </div>
        <LoanForm
          handleCalculate={handleCalculate}
          handleReset={handleReset}
          onInputChange={handleInputChange}
        />
      </div>
      {emi.length > 0 && (
        <>
          <div className="loan_section">
            <LoanTable loanInfo={loanInfo} />
          </div>
          <div className="emi_section">
            <EmiTable emi={emi} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
