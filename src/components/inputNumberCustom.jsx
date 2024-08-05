import { Input } from "antd";

const InputNumberCustom = ({ value, onChange, number, setNumber }) => {
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

  return (
    <span>
      <Input type="text" value={value || number} onChange={onNumberChange} />
    </span>
  );
};

export default InputNumberCustom;
