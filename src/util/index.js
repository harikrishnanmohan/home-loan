export const toIndianCurrency = (amount) => {
  return amount.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "INR",
  });
};

export const fromIndianCurrency = (value) => {
  if (typeof value === "string") {
    return Number(value.replace(/[^0-9.-]+/g, ""));
  }
  return value;
};
