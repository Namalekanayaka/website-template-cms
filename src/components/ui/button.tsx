import { cn } from '@/utilities/ui'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 relative overflow-hidden shadow-sm',
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        clear: '',
        default: 'h-10 px-4 py-2 text-sm',
        icon: 'h-10 w-10 text-sm',
        lg: 'h-12 rounded-md px-8 text-base',
        sm: 'h-8 rounded px-3 text-xs',
      },
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/30',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-destructive/30',
        ghost: 'bg-transparent hover:bg-accent hover:text-accent-foreground shadow-none',
        link: 'text-primary items-start justify-start underline-offset-4 hover:underline bg-transparent shadow-none p-0',
        outline:
          'border-2 border-border bg-background hover:bg-accent/10 hover:text-accent-foreground shadow-none',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-secondary/30',
      },
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  ref?: React.Ref<HTMLButtonElement>
}

const Button: React.FC<ButtonProps> = ({
  asChild = false,
  className,
  size,
  variant,
  ref,
  ...props
}) => {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ className, size, variant }))} ref={ref} {...props} />
}

export { Button, buttonVariants }
