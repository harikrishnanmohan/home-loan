import { useState } from "react";
import { toIndianCurrency } from "../util";
import "./EmiTable.scss";

const EmiTable = ({ emi }) => {
  const currentYear = new Date().getFullYear();
  const [openYear, setOpenYear] = useState(1);

  // Group EMI data by year
  const emiByYear = emi.reduce((acc, emiItem) => {
    const year = Math.ceil(emiItem.month / 12);
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(emiItem);
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
        const calendarYear = currentYear + (Number(year) - 1);
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
                  Year {year} ({calendarYear})
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
                        currentYear,
                        (emiItem.month - 1) % 12
                      );
                      const monthName = monthDate.toLocaleString("default", {
                        month: "short",
                      });
                      return (
                        <tr key={emiItem.month}>
                          <td>
                            {monthName} {calendarYear}
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
