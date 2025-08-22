import * as React from 'react'
import { cn } from '@/lib/utils'

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: number
  onChange?: (value: number) => void
  allowDecimals?: boolean
  formatThousands?: boolean
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, value, onChange, allowDecimals = false, formatThousands = false, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState('')
    const [isFocused, setIsFocused] = React.useState(false)

    // Format number for display
    const formatNumber = (num: number): string => {
      if (num === 0 || isNaN(num)) return ''
      
      if (formatThousands && num >= 1000) {
        return new Intl.NumberFormat('en-US').format(num)
      }
      
      if (allowDecimals) {
        return num.toFixed(num % 1 === 0 ? 0 : 2)
      }
      
      return Math.round(num).toString()
    }

    // Parse display value to number
    const parseValue = (str: string): number => {
      const cleaned = str.replace(/[,]/g, '')
      const parsed = allowDecimals ? parseFloat(cleaned) : parseInt(cleaned, 10)
      return isNaN(parsed) ? 0 : parsed
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
      // Allow: backspace, delete, tab, escape, enter
      if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
          // Allow decimal point only if decimals are allowed
          (allowDecimals && [110, 190].indexOf(e.keyCode) !== -1) ||
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
      <input
        type="text"
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
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
    )
  }
)
NumberInput.displayName = 'NumberInput'

export { NumberInput } 