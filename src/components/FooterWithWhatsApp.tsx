import React from "react";
import Footer from "./Footer";

const FooterWithWhatsApp: React.FC = () => {
  // Read WhatsApp number from env (no plus or spaces), fallback to default
  const whatsappNumber = (import.meta as any).env?.VITE_WHATSAPP ?? "905395263293";
  const whatsappText = encodeURIComponent("Merhaba Dezemu, size WhatsApp üzerinden ulaşmak istiyorum.");
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${whatsappText}`;

  const floatStyle: React.CSSProperties = {
    position: "fixed",
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 9999,
    background: "#25D366",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 6px 18px rgba(37,211,102,0.2)",
    zIndex: 9999,
  };

  const srOnly: React.CSSProperties = {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: "1px",
    margin: "-1px",
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    width: "1px",
    whiteSpace: "nowrap",
  };

  return (
    <>
      <Footer />
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp ile iletişim"
        title="WhatsApp ile iletişim"
        style={floatStyle}
      >
        <span style={srOnly}>WhatsApp ile iletişim</span>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.52 3.48A11.88 11.88 0 0012.06 0C5.42 0 .18 5.24.18 11.88c0 2.09.55 4.13 1.6 5.93L0 24l6.32-1.62A11.86 11.86 0 0012.06 24c6.64 0 11.88-5.24 11.88-11.88 0-3.18-1.24-6.17-3.42-8.64z" fill="#ffffff" opacity="0.06"/>
          <path d="M18.3 5.7a9.05 9.05 0 00-6.24-2.58c-5.02 0-9.1 4.08-9.1 9.1 0 1.6.42 3.14 1.22 4.5L3 21.6l4.02-1.06a9.06 9.06 0 004.04 0c4.06 0 7.88-2.48 9.1-6.08a9.05 9.05 0 00-2.86-8.83z" fill="#25D366"/>
          <path d="M16.1 14.1c-.22-.11-1.3-.64-1.5-.72-.2-.08-.35-.11-.5.11-.16.22-.62.72-.76.87-.14.16-.28.18-.5.07-.2-.11-.85-.31-1.62-.98-.6-.54-1.01-1.2-1.13-1.43-.12-.23-.01-.34.09-.45.09-.1.2-.28.3-.42.1-.14.14-.23.21-.38.07-.14.03-.27-.02-.38-.05-.11-.5-1.2-.68-1.64-.18-.43-.36-.37-.5-.38l-.42-.01c-.14 0-.36.05-.55.23-.19.18-.72.7-.72 1.7s.74 1.97.84 2.11c.1.14 1.45 2.22 3.52 3.12 2.07.9 2.07.6 2.45.56.38-.04 1.23-.5 1.4-1.01.17-.5.17-.93.12-1.02-.05-.09-.18-.14-.4-.24z" fill="#fff"/>
        </svg>
      </a>
    </>
  );
};

export default FooterWithWhatsApp;
