import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        success:
          "border-transparent bg-green-700/5 text-green-700 [a&]:hover:bg-green-700/10 focus-visible:ring-green-700/20 dark:focus-visible:ring-green-700/40 dark:bg-green-700/60",
        warning:
          "border-transparent bg-yellow-700/5 text-yellow-700 [a&]:hover:bg-yellow-700/10 focus-visible:ring-yellow-700/20 dark:focus-visible:ring-yellow-700/40 dark:bg-yellow-700/60",
        new: "border-transparent bg-green-700/5 text-green-700 hover:bg-green-700/10 focus-visible:ring-green-700/20 dark:focus-visible:ring-green-700/40 dark:bg-green-700/60",
        confirmed:
          "border-transparent bg-indigo-700/5 text-indigo-700 hover:bg-indigo-700/10 focus-visible:ring-indigo-700/20 dark:focus-visible:ring-indigo-700/40 dark:bg-indigo-700/60",

        shipped:
          "border-transparent bg-sky-700/5 text-sky-700 hover:bg-sky-700/10 focus-visible:ring-sky-700/20 dark:focus-visible:ring-sky-700/40 dark:bg-sky-700/60",

        delivered:
          "border-transparent bg-yellow-700/5 text-yellow-700 hover:bg-yellow-700/10 focus-visible:ring-yellow-700/20 dark:focus-visible:ring-yellow-700/40 dark:bg-yellow-700/60",

        cancelled:
          "border-transparent bg-gray-700/5 text-gray-700 hover:bg-gray-700/10 focus-visible:ring-gray-700/20 dark:focus-visible:ring-gray-700/40 dark:bg-gray-700/60",

        failed:
          "border-transparent bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        disable:
          "bg-gray-500/5 text-gray-500 hover:bg-gray-500/10 focus-visible:ring-gray-500/20 dark:focus-visible:ring-gray-500/40 dark:bg-gray-500/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
