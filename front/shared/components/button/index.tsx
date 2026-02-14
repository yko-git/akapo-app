interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  mode?: keyof typeof buttonColors;
}

const buttonColors = {
  Danger: "bg-[#bb2d3b]",
  Success: "bg-[#FC7840]",
  Warning: "bg-[#ffc107]",
  Info: "bg-[#6C9FE0]",
};

const Button: React.FC<ButtonProps> = ({
  mode = "Info",
  children,
  className,
  ...props
}) => {
  const buttonColor = buttonColors[mode] || buttonColors.Info;
  return (
    <button {...props} className={`${buttonColor} ${className ?? ""}`}>
      {children}
    </button>
  );
};

export default Button;
