export interface SelectBoxProps {
  options: { value: string; label: string }[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
}
