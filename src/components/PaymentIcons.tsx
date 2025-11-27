import React from "react";

type IconProps = { title?: string; className?: string };

export const MastercardIcon: React.FC<IconProps> = ({ title = "Mastercard", className }) => (
  <svg
    className={className}
    width="48"
    height="30"
    viewBox="0 0 48 30"
    aria-hidden={title ? "false" : "true"}
    role="img"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <rect width="48" height="30" rx="4" fill="transparent" />
    <g transform="translate(4,3)" fill="none" fillRule="evenodd">
      <circle cx="10" cy="12" r="9" fill="#EB001B" />
      <circle cx="26" cy="12" r="9" fill="#F79E1B" />
      <path d="M18 12a8.5 8.5 0 01-1.4 4.9 8.5 8.5 0 010-9.8A8.5 8.5 0 0118 12z" fill="#FF5F00" />
    </g>
  </svg>
);

export const VisaIcon: React.FC<IconProps> = ({ title = "Visa", className }) => (
  <svg
    className={className}
    width="64"
    height="24"
    viewBox="0 0 64 24"
    aria-hidden={title ? "false" : "true"}
    role="img"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <rect width="64" height="24" rx="3" fill="transparent" />
    <g fill="#1A1F71">
      <path d="M6 6h4l3.6 12h-4L6 6zM17 6h3.4l-1 12H17V6zM23.2 6h3.6l3 9.6L33.9 6h3.7l-4.7 12h-3.6l-2.9-9.2L23.2 18H19.6L23.2 6zM40 6h3.3l-1 12H40V6z" />
      <path d="M47.5 6h6.1c2.9 0 4.8 1.6 4.8 4.1 0 2.4-1.9 3.6-3.5 4.1l4 3.6h-3.1l-3.8-3.3h-1.6v3.3H47.5V6zm5.6 6.3c1 0 2-.3 2-.9s-.9-.9-2-.9h-2.8v1.8H53.1z" />
    </g>
  </svg>
);

export const TroyIcon: React.FC<IconProps> = ({ title = "Troy", className }) => (
  <svg
    className={className}
    width="48"
    height="24"
    viewBox="0 0 48 24"
    aria-hidden={title ? "false" : "true"}
    role="img"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <rect width="48" height="24" rx="3" fill="transparent" />
    <g fill="#E4002B">
      <path d="M8 6h8l2 6 2-6h8l-6.6 12H14.6L8 6z" />
    </g>
  </svg>
);

const PaymentIcons: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={className}
      aria-hidden="false"
      role="contentinfo"
      style={{
        display: "flex",
        gap: 16,
        alignItems: "center",
        justifyContent: "center",
        padding: "12px 8px",
      }}
    >
      <MastercardIcon />
      <VisaIcon />
      <TroyIcon />
    </div>
  );
};

export default PaymentIcons;
