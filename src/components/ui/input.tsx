import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input ref={ref} className={cn('px-4 py-2 border rounded-md w-full', className)} {...props} />
    )
  }
)
Input.displayName = 'Input'
