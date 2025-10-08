import type { ReactNode } from "react";

interface ErrorProps {
  children: ReactNode;
}

export const Error: React.FC<ErrorProps> = ({ children }) => {
  return (
    <div className="mt-1 bg-red-500 text-white font-semibold px-3 py-1 rounded text-xs inline-block">
      {children}
    </div>
  );
};
