import { useState } from "react";
import { toIndianCurrency } from "../util";
import "./EmiTable.scss";

const EmiTable = ({ emi }) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-11
  const [openYear, setOpenYear] = useState(1);

  // Group EMI data by year, considering current month as start
  const emiByYear = emi.reduce((acc, emiItem) => {
    // Calculate which year this payment belongs to based on current month
    const monthsFromStart = emiItem.month - 1; // Convert to 0-based
    const monthsOffset = 11 - currentMonth; // Remaining months in current year
    const yearIndex = Math.floor((monthsFromStart + currentMonth) / 12) + 1;

    if (!acc[yearIndex]) {
      acc[yearIndex] = [];
    }
    acc[yearIndex].push({
      ...emiItem,
      actualMonth: (currentMonth + monthsFromStart) % 12, // 0-11
      actualYear:
        currentYear + Math.floor((currentMonth + monthsFromStart) / 12),
    });
    return acc;
  }, {});

  // Calculate year totals
  const calculateYearTotals = (yearData) => {
    return yearData.reduce(
      (totals, item) => ({
        emi: totals.emi + item.monthlyEmi,
        loanShare: totals.loanShare + item.loanShare,
        interestShare: totals.interestShare + item.interestShare,
        extraPrinciple: totals.extraPrinciple + item.extraPrinciple,
      }),
      { emi: 0, loanShare: 0, interestShare: 0, extraPrinciple: 0 }
    );
  };

  return (
    <div className="emi-accordion">
      <h2>EMI Details</h2>
      {Object.entries(emiByYear).map(([year, yearData]) => {
        const yearTotals = calculateYearTotals(yearData);
        const firstMonth = yearData[0];
        const lastMonth = yearData[yearData.length - 1];
        const yearRange =
          firstMonth.actualYear === lastMonth.actualYear
            ? firstMonth.actualYear
            : `${firstMonth.actualYear}-${lastMonth.actualYear}`;

        return (
          <div key={year} className="accordion-item">
            <button
              className={`accordion-header ${
                openYear === Number(year) ? "active" : ""
              }`}
              onClick={() =>
                setOpenYear(openYear === Number(year) ? null : Number(year))
              }
            >
              <div className="year-summary">
                <h3>
                  Year {year} ({yearRange})
                </h3>
                <div className="year-totals">
                  <span className="no-dot">
                    Total EMI: {toIndianCurrency(yearTotals.emi)}
                  </span>
                  <span className="no-dot">
                    Principal: {toIndianCurrency(yearTotals.loanShare)}
                  </span>
                  <span className="no-dot">
                    Interest: {toIndianCurrency(yearTotals.interestShare)}
                  </span>
                </div>
              </div>
              <span className="accordion-icon">
                {openYear === Number(year) ? "−" : "+"}
              </span>
            </button>

            {openYear === Number(year) && (
              <div className="accordion-content">
                <table>
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>EMI</th>
                      <th>Principal</th>
                      <th>Interest</th>
                      <th>Balance</th>
                      <th>Extra Principal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearData.map((emiItem) => {
                      const monthDate = new Date(
                        emiItem.actualYear,
                        emiItem.actualMonth
                      );
                      const monthName = monthDate.toLocaleString("default", {
                        month: "short",
                      });
                      return (
                        <tr key={emiItem.month}>
                          <td>
                            {monthName} {emiItem.actualYear}
                          </td>
                          <td>{toIndianCurrency(emiItem.monthlyEmi)}</td>
                          <td>{toIndianCurrency(emiItem.loanShare)}</td>
                          <td>{toIndianCurrency(emiItem.interestShare)}</td>
                          <td>
                            {emiItem.loanBalance > 0
                              ? toIndianCurrency(emiItem.loanBalance)
                              : "₹0"}
                          </td>
                          <td>{toIndianCurrency(emiItem.extraPrinciple)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default EmiTable;
