const Button = ({ onClick, children }: any) => {
  return (
    <button
      onClick={onClick}
      className="text-white bg-[#FC7840] focus:ring-4 font-semibold tracking-widest rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
    >
      {children}
    </button>
  );
};

export default Button;
