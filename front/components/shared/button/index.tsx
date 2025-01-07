interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  mode: keyof typeof buttonColors;
}

const buttonColors = {
  Danger: "bg-[#bb2d3b]",
  Success: "bg-[#FC7840]",
  Warning: "bg-[#ffc107]",
  Info: "bg-[#17a2b8]",
};

const Button: React.FC<ButtonProps> = ({ onClick, children, mode }) => {
  const buttonColor = buttonColors[mode] || "bg-[#6C9FE0]";
  return (
    <button
      onClick={onClick}
      className={`text-white focus:ring-4 font-semibold tracking-widest rounded-lg text-sm px-5 py-2.5 me-2 mb-2 whitespace-nowrap ${buttonColor}`}
    >
      {children}
    </button>
  );
};

export default Button;
