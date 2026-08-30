import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    // basic mock of cva
    let variantClasses = "bg-slate-900 text-slate-50 shadow hover:bg-slate-900/90";
    if (variant === "outline") variantClasses = "border border-slate-200 bg-white shadow-sm hover:bg-slate-100 hover:text-slate-900";
    if (variant === "ghost") variantClasses = "hover:bg-slate-100 hover:text-slate-900";
    if (variant === "secondary") variantClasses = "bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-100/80";
    if (variant === "destructive") variantClasses = "bg-red-500 text-slate-50 shadow-sm hover:bg-red-500/90";
    if (variant === "link") variantClasses = "text-slate-900 underline-offset-4 hover:underline";

    let sizeClasses = "h-9 px-4 py-2";
    if (size === "sm") sizeClasses = "h-8 rounded-md px-3 text-xs";
    if (size === "lg") sizeClasses = "h-10 rounded-md px-8";
    if (size === "icon") sizeClasses = "h-9 w-9";

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50",
          variantClasses,
          sizeClasses,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
