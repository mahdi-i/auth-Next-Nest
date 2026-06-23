import { cn } from "@/shared/utils/shadcn/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}
export const H1 = ({ children, className, ...props }: TypographyProps) => (
  <h1
    className={cn(
      "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      className,
    )}
    {...props}
  >
    {children}
  </h1>
);

export const H2 = ({ children, className, ...props }: TypographyProps) => (
  <h2
    className={cn(
      "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      className,
    )}
    {...props}
  >
    {children}
  </h2>
);

export const H3 = ({ children, className, ...props }: TypographyProps) => (
  <h3
    className={cn(
      "scroll-m-20 text-2xl font-semibold tracking-tight",
      className,
    )}
    {...props}
  >
    {children}
  </h3>
);

export const H4 = ({ children, className, ...props }: TypographyProps) => (
  <h4
    className={cn(
      "scroll-m-20 text-xl font-semibold tracking-tight",
      className,
    )}
    {...props}
  >
    {children}
  </h4>
);

export const P = ({ children, className, ...props }: TypographyProps) => (
  <p className={cn("leading-7 not-first:mt-6", className)} {...props}>
    {children}
  </p>
);

export const Blockquote = ({
  children,
  className,
  ...props
}: TypographyProps) => (
  <blockquote
    className={cn("mt-6 border-l-2 pl-6 italic", className)}
    {...props}
  >
    {children}
  </blockquote>
);

export const List = ({ children, className, ...props }: TypographyProps) => (
  <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)} {...props}>
    {children}
  </ul>
);

export const InlineCode = ({
  children,
  className,
  ...props
}: TypographyProps) => (
  <code
    className={cn(
      "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      className,
    )}
    {...props}
  >
    {children}
  </code>
);

export const Lead = ({ children, className, ...props }: TypographyProps) => (
  <p className={cn("text-xl text-muted-foreground", className)} {...props}>
    {children}
  </p>
);

export const Large = ({ children, className, ...props }: TypographyProps) => (
  <div className={cn("text-lg font-semibold", className)} {...props}>
    {children}
  </div>
);

export const Small = ({ children, className, ...props }: TypographyProps) => (
  <small
    className={cn("text-sm font-medium leading-none", className)}
    {...props}
  >
    {children}
  </small>
);

export const Muted = ({ children, className, ...props }: TypographyProps) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props}>
    {children}
  </p>
);
