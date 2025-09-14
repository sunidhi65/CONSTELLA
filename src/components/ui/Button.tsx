import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`w-full bg-slate-800/80 border-2 border-amber-400/60 text-amber-300/90 font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:border-amber-400 hover:text-amber-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;