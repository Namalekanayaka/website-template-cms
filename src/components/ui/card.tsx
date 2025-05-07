import { cn } from '@/utilities/ui'
import * as React from 'react'

const Card: React.FC<
  { ref?: React.Ref<HTMLDivElement> } & React.HTMLAttributes<HTMLDivElement>
> = ({ className, ref, ...props }) => (
  <div
    className={cn(
      'rounded-xl border border-border/40 bg-card text-card-foreground shadow-md hover:shadow-lg transition-all duration-300 backdrop-blur-sm',
      className,
    )}
    ref={ref}
    {...props}
  />
)

const CardHeader: React.FC<
  { ref?: React.Ref<HTMLDivElement> } & React.HTMLAttributes<HTMLDivElement>
> = ({ className, ref, ...props }) => (
  <div
    className={cn('flex flex-col space-y-2 p-6 border-b border-border/30', className)}
    ref={ref}
    {...props}
  />
)

const CardTitle: React.FC<
  { ref?: React.Ref<HTMLHeadingElement> } & React.HTMLAttributes<HTMLHeadingElement>
> = ({ className, ref, ...props }) => (
  <h3
    className={cn('text-2xl font-bold leading-none tracking-tight text-foreground/90', className)}
    ref={ref}
    {...props}
  />
)

const CardDescription: React.FC<
  { ref?: React.Ref<HTMLParagraphElement> } & React.HTMLAttributes<HTMLParagraphElement>
> = ({ className, ref, ...props }) => (
  <p
    className={cn('text-sm text-muted-foreground leading-relaxed', className)}
    ref={ref}
    {...props}
  />
)

const CardContent: React.FC<
  { ref?: React.Ref<HTMLDivElement> } & React.HTMLAttributes<HTMLDivElement>
> = ({ className, ref, ...props }) => (
  <div className={cn('p-6 pt-4', className)} ref={ref} {...props} />
)

const CardFooter: React.FC<
  { ref?: React.Ref<HTMLDivElement> } & React.HTMLAttributes<HTMLDivElement>
> = ({ className, ref, ...props }) => (
  <div
    className={cn('flex items-center justify-between p-6 pt-0 mt-2', className)}
    ref={ref}
    {...props}
  />
)

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
