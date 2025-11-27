import React from "react";
import PaymentIcons from "./PaymentIcons";

/**
 * PaymentsBar
 * - Renders a fixed bottom bar with Mastercard, Visa, Troy icons.
 * - If you have a floating WhatsApp button, adjust offsetFromBottom to avoid overlap.
 */

const PaymentsBar: React.FC<{ offsetFromBottom?: number }> = ({ offsetFromBottom = 0 }) => {
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
