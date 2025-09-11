import React from 'react'
import { HelpCircle } from 'lucide-react'

interface TooltipProps {
  content: string
  children?: React.ReactNode
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = React.useState(false)

  return (
    <div className="relative inline-flex items-center">
      {children}
      <div
        className="ml-2 cursor-help"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        tabIndex={0}
      >
        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
      </div>
      
      {isVisible && (
        <div className="absolute bottom-full left-0 mb-2 z-50 w-72 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg">
          <div className="relative">
            {content}
            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  )
}

interface FieldTooltipProps {
  content: string
}

export const FieldTooltip: React.FC<FieldTooltipProps> = ({ content }) => {
  return <Tooltip content={content} />
} 