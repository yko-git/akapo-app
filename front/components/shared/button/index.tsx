interface ButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
  mode?: keyof typeof buttonColors;
  type?: "button" | "submit";
  disabled?: boolean;
}

const buttonColors = {
  Danger: "bg-[#bb2d3b]",
  Success: "bg-[#FC7840]",
  Warning: "bg-[#ffc107]",
  Info: "bg-[#6C9FE0]",
};

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  mode = "Info",
  type = "submit",
  disabled = false,
}) => {
  const buttonColor = buttonColors[mode] || "bg-[#6C9FE0]";
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`text-white focus:ring-4 font-semibold tracking-widest rounded-lg text-sm px-5 py-2.5 mb-2 whitespace-nowrap ${buttonColor}`}
    >
      {children}
    </button>
  );
};

export default Button;
