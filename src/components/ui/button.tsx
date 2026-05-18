/* eslint-disable react-refresh/only-export-components */
import * as React from 'react'
import { type VariantProps, cva } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-border-focus active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-error aria-invalid:ring-2 aria-invalid:ring-error-muted dark:aria-invalid:border-error/50 dark:aria-invalid:ring-error-muted/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'btn-primary-gradient text-text-on-primary rounded-pill',
        outline:
          'border-border-low bg-transparent hover:bg-bg-surface hover:text-text-primary aria-expanded:bg-bg-surface aria-expanded:text-text-primary rounded-base',
        secondary:
          'bg-bg-surface text-text-secondary hover:bg-interactive-hover hover:text-text-primary aria-expanded:bg-interactive-active aria-expanded:text-text-primary rounded-base',
        ghost:
          'hover:bg-interactive-hover hover:text-text-primary aria-expanded:bg-interactive-active aria-expanded:text-text-primary rounded-base',
        destructive:
          'bg-error/10 text-error hover:bg-error/20 focus-visible:ring-error-muted/40 dark:bg-error/20 dark:hover:bg-error/30 rounded-sm',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 gap-2 px-6',
        sm: 'h-8 gap-1.5 px-4 text-xs',
        xs: 'h-7 gap-1 px-3 text-[10px]',
        lg: 'h-12 gap-2.5 px-8 text-base',
        icon: 'size-10',
        'icon-sm': 'size-8',
        'icon-xs': 'size-7',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
