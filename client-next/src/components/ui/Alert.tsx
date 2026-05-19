import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

const alertVariants = cva(
  "relative w-full rounded-2xl border p-4 [&>svg~*]:pl-8 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-white border-brand-sand text-brand-espresso [&>svg]:text-brand-bronze",
        destructive:
          "border-rose-200 bg-rose-50 text-rose-900 [&>svg]:text-rose-600",
        success:
          "border-emerald-200 bg-emerald-50 text-emerald-900 [&>svg]:text-emerald-600",
        warning:
          "border-amber-200 bg-amber-50 text-amber-900 [&>svg]:text-amber-600",
        info:
          "border-blue-200 bg-blue-50 text-blue-900 [&>svg]:text-blue-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-bold leading-none tracking-tight text-[13.5px]", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-[12.5px] [&_p]:leading-relaxed font-medium opacity-90", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
