import { fromIndianCurrency } from "../util";

import "./LoanTable.scss";

const LoanTable = ({ loanInfo }) => {
  return (
    <>
      <h2>Loan Details</h2>
      <table className="loan_table">
        <tbody>
          {Object.entries(loanInfo).map(
            (item) =>
              fromIndianCurrency(item[1]) !== 0 && (
                <tr key={item[0]} className="table_row">
                  <th>{item[0]}</th>
                  <td>{item[1]}</td>
                </tr>
              )
          )}
        </tbody>
      </table>
    </>
  );
};
export default LoanTable;
