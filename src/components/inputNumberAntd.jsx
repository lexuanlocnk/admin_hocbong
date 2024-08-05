import { Input } from "antd";
import { useState } from "react";

const NumberInput = ({ value, onChange }) => {
  const [number, setNumber] = useState(value || 0);

  const triggerChange = (changedValue) => {
    onChange?.(changedValue);
  };

  const onNumberChange = (e) => {
    const newNumber = parseInt(e.target.value || "0", 10);
    if (Number.isNaN(newNumber)) {
      return;
    }
    setNumber(newNumber);
    triggerChange(newNumber);
  };

  // const formatNumber = (value) => {
  //   if (!value) return "";
  //   const formattedValue = value
  //     .toString()
  //     .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  //   return formattedValue;
  // };

  // const parseNumber = (value) => {
  //   if (!value) return null;
  //   const parsedValue = value.replace(/,/g, "");
  //   return Number(parsedValue);
  // };

  return (
    <span>
      <Input type="text" value={value || number} onChange={onNumberChange} />
    </span>
  );
};

export default NumberInput;
