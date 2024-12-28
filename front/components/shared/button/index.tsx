const Button = ({ onClick, children, mode }: any) => {
  const setButtonColor = (mode: string) => {
    switch (mode) {
      case "Danger":
        return "bg-[#bb2d3b]";
      case "Success":
        return "bg-[#FC7840]";
      case "Warning":
        return "bg-[#ffc107]";
      case "Info":
        return "bg-[#17a2b8]";
      default:
        return "bg-[#6C9FE0]";
    }
  };
  return (
    <button
      onClick={onClick}
      className={`text-white focus:ring-4 font-semibold tracking-widest rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${setButtonColor(
        mode
      )}`}
    >
      {children}
    </button>
  );
};

export default Button;
