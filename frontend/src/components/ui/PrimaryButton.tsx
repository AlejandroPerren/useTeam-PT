import type { ReactNode, ButtonHTMLAttributes } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const PrimaryButton = ({ children, ...props }: PrimaryButtonProps) => {
  return (
    <button
      className={`w-full bg-rose-500 text-white py-3 px-4 rounded-md hover:bg-rose-600 transition-colors`}
      {...props}
    >
      {children}
    </button>
  );
};
