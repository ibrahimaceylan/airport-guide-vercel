import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

import { transitions } from "@/styles/design-tokens";

type ButtonVariant = "primary" | "secondary" | "ghost" | "unstyled";

type BaseButtonProps = {
  label?: ReactNode;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
  iconPosition?: "left" | "right";
  variant?: ButtonVariant;
  className?: string;
  children?: ReactNode;
};

type ButtonProps = BaseButtonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "inline-flex items-center justify-center gap-2 bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_22px_40px_-22px_rgba(14,165,233,0.45)] hover:bg-sky-400",
  secondary:
    "inline-flex items-center justify-center gap-2 border border-sky-200 bg-white px-5 py-2 text-sm font-semibold text-sky-700 shadow-sm hover:border-sky-300 hover:text-sky-600",
  ghost: "inline-flex items-center justify-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-600",
  unstyled: "",
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      label,
      icon,
      trailingIcon,
      iconPosition = "left",
      variant = "primary",
      className,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const content =
      children ?? (
        <>
          {icon && iconPosition === "left" ? <span className="shrink-0">{icon}</span> : null}
          {label ? <span>{label}</span> : null}
          {icon && iconPosition === "right" ? <span className="shrink-0">{icon}</span> : null}
          {trailingIcon ? <span className="shrink-0">{trailingIcon}</span> : null}
        </>
      );

    const classes = [
      variantClasses[variant],
      variant !== "unstyled" ? transitions.base : "",
      focusRing,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} type={type} className={classes} {...props}>
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
