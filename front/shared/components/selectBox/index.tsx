import { SelectBoxProps } from "@/types";

const SelectBox = ({
  options,
  onChange,
  multiple = false,
  value,
}: SelectBoxProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (multiple) {
      const values = Array.from(e.target.selectedOptions).map(
        (opt: HTMLOptionElement) => opt.value
      );
      onChange(values);
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <div>
      <select
        onChange={handleChange}
        multiple={multiple}
        value={value}
        className="border rounded p-2 w-full"
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectBox;
