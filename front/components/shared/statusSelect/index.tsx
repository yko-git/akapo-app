import { Status } from "@/types";

const StatusSelect = ({ value, onChange }: Status) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded p-2 w-full"
    >
      <option value="0">下書き</option>
      <option value="1">公開</option>
    </select>
  );
};

export default StatusSelect;
