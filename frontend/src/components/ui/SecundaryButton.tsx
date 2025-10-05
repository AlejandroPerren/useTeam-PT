import type { ReactNode, ButtonHTMLAttributes } from 'react'

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export const SecondaryButton = ({
  children,
  ...props
}: SecondaryButtonProps) => {
  return (
    <button
      className={`w-full bg-gray-700 text-white py-3 px-4 rounded-md hover:bg-gray-600 transition-colors `}
      {...props}
    >
      {children}
    </button>
  )
}
