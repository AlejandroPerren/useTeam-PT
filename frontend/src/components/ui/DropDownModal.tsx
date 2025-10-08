import { useEffect, useRef, type ReactNode } from "react";

interface DropdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function DropdownModal({
  isOpen,
  onClose,
  children,
}: DropdownModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-start pt-20 z-50">
      <div
        ref={modalRef}
        className="bg-gray-900 text-white p-6 rounded-2xl shadow-2xl w-[90%] max-w-md border border-gray-700 animate-fadeIn"
      >
        {children}
      </div>
    </div>
  );
}
