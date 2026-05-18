import React from 'react'
import { Sparkles } from 'lucide-react'
import { cn } from '../lib/utils'

interface PromptSuggestionsProps {
  suggestions: string[]
  onSelect: (suggestion: string) => void
  className?: string
}

const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({
  suggestions,
  onSelect,
  className,
}) => {
  if (suggestions.length === 0) return null

  return (
    <div
      className={cn(
        'animate-in fade-in slide-in-from-top-1 mt-4 flex flex-wrap gap-2 duration-300',
        className,
      )}
    >
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          data-testid={`suggestion-${index}`}
          onClick={() => onSelect(suggestion)}
          className="rounded-pill bg-bg-sunken border-border-low hover:bg-bg-surface hover:border-border-mid text-text-muted hover:text-text-primary group flex items-center gap-1.5 border px-3 py-1.5 text-xs font-bold shadow-sm transition-all select-none hover:scale-[1.02]"
        >
          <Sparkles
            size={10}
            className="text-text-muted/40 group-hover:text-primary transition-colors"
          />
          {suggestion}
        </button>
      ))}
    </div>
  )
}

export default PromptSuggestions
