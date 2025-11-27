import React from "react";
import PaymentIcons from "./PaymentIcons";

/**
 * PaymentsBar
 * - Separate component so Footer.tsx remains unchanged.
 * - Renders a fixed bottom bar with Mastercard, Visa, Troy icons.
 * - Import and render this component in your main layout or App.tsx.
 */

const PaymentsBar: React.FC<{ offsetFromBottom?: number }> = ({ offsetFromBottom = 0 }) => {
  // offsetFromBottom lets you leave space for other fixed elements (e.g. WhatsApp button)
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: offsetFromBottom,
        background: "#fafafa",
        borderTop: "1px solid #eee",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6px 8px",
        zIndex: 9998,
      }}
    >
      <PaymentIcons />
    </div>
  );
};

export default PaymentsBar;
