import { toIndianCurrency } from "../util";
import "./EmiTable.scss";

const EmiTable = ({ emi }) => {
  return (
    <>
      <h2>Emi Details</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Emi</th>
            <th scope="col">Loan Share</th>
            <th scope="col">Interest Share</th>
            <th scope="col">Loan Balance</th>
            <th scope="col">Extra Principle</th>
          </tr>
        </thead>
        <tbody>
          {emi.map((emiItem) => (
            <tr
              className={`emi_row ${emiItem.month % 12 === 0 ? "year" : ""}`}
              key={emiItem.month}
            >
              <td>
                {emiItem.month}
                {emiItem.month % 12 === 0
                  ? " (Year " + emiItem.month / 12 + ")"
                  : ""}
              </td>
              <td>{toIndianCurrency(emiItem.monthlyEmi)}</td>
              <td>{toIndianCurrency(emiItem.loanShare)}</td>
              <td>{toIndianCurrency(emiItem.interestShare)}</td>
              <td>
                {emiItem.loanBalance > 0
                  ? toIndianCurrency(emiItem.loanBalance)
                  : 0}
              </td>
              <td>{toIndianCurrency(emiItem.extraPrinciple)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
export default EmiTable;
