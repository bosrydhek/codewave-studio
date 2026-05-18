import React from 'react'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="animate-in fade-in zoom-in flex flex-col items-center justify-center p-12 text-center font-sans duration-700">
      <div className="bg-bg-surface rounded-modal border-border-low mb-8 flex h-20 w-20 items-center justify-center border shadow-2xl">
        <Icon size={32} className="text-primary" />
      </div>
      <h3 className="text-text-primary font-display mb-2 text-xl font-normal tracking-tight">
        {title}
      </h3>
      <p className="text-text-muted mb-8 max-w-[240px] text-sm leading-relaxed italic">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-primary-gradient text-text-on-primary rounded-pill px-6 py-2.5 text-sm font-bold shadow-lg transition-all hover:opacity-90 active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default EmptyState
