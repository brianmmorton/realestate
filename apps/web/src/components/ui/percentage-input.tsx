import * as React from 'react'
import { cn } from '@/lib/utils'

export interface PercentageInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: number
  onChange?: (value: number) => void
  maxValue?: number
  step?: number
}

const PercentageInput = React.forwardRef<HTMLInputElement, PercentageInputProps>(
  ({ className, value, onChange, maxValue = 100, step = 0.1, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState('')
    const [isFocused, setIsFocused] = React.useState(false)

    // Format number for display
    const formatNumber = (num: number): string => {
      if (num === 0 || isNaN(num)) return ''
      return num.toFixed(num % 1 === 0 ? 0 : 2)
    }

    // Parse display value to number
    const parseValue = (str: string): number => {
      const cleaned = str.replace(/[%]/g, '')
      const parsed = parseFloat(cleaned)
      if (isNaN(parsed)) return 0
      // Clamp value between 0 and maxValue
      return Math.max(0, Math.min(maxValue, parsed))
    }

    // Update display value when value prop changes
    React.useEffect(() => {
      if (!isFocused) {
        setDisplayValue(value ? formatNumber(value) : '')
      }
    }, [value, isFocused])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      setDisplayValue(inputValue)
      
      const numericValue = parseValue(inputValue)
      onChange?.(numericValue)
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      // Show raw number when focused for easier editing
      setDisplayValue(value && value !== 0 ? value.toString() : '')
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      // Format the number when focus is lost
      setDisplayValue(value ? formatNumber(value) : '')
      props.onBlur?.(e)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow: backspace, delete, tab, escape, enter, decimal point
      if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
          // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
          (e.keyCode === 65 && e.ctrlKey === true) ||
          (e.keyCode === 67 && e.ctrlKey === true) ||
          (e.keyCode === 86 && e.ctrlKey === true) ||
          (e.keyCode === 88 && e.ctrlKey === true) ||
          (e.keyCode === 90 && e.ctrlKey === true) ||
          // Allow: home, end, left, right
          (e.keyCode >= 35 && e.keyCode <= 39)) {
        return
      }
      // Ensure that it is a number and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault()
      }
      
      props.onKeyDown?.(e)
    }

    return (
      <div className="relative">
        <input
          type="text"
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background pl-3 pr-7 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          ref={ref}
          {...props}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
          %
        </span>
      </div>
    )
  }
)
PercentageInput.displayName = 'PercentageInput'

export { PercentageInput } 