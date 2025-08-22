import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: number
  onChange?: (value: number) => void
  showCurrencySymbol?: boolean
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value, onChange, showCurrencySymbol = true, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState('')
    const [isFocused, setIsFocused] = React.useState(false)

    // Format number for display
    const formatNumber = (num: number): string => {
      if (num === 0 || isNaN(num)) return ''
      return new Intl.NumberFormat('en-US').format(num)
    }

    // Parse display value to number
    const parseValue = (str: string): number => {
      const cleaned = str.replace(/[,$]/g, '')
      const parsed = parseFloat(cleaned)
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

    return (
      <div className="relative">
        {showCurrencySymbol && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
            $
          </span>
        )}
        <input
          type="text"
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            showCurrencySymbol ? 'pl-7 pr-3' : 'px-3',
            className
          )}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
CurrencyInput.displayName = 'CurrencyInput'

export { CurrencyInput } 