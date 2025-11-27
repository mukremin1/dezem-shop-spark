import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const siteName = (import.meta as any).env?.VITE_SITE_NAME ?? "Dezemu";
  const supportEmail = (import.meta as any).env?.VITE_SUPPORT_EMAIL ?? "destek@dezemu.com";
  const siteUrl = (import.meta as any).env?.VITE_SITE_URL ?? "https://dezemu.com/";
  const year = new Date().getFullYear();

  const footerStyle: React.CSSProperties = {
    padding: 16,
    textAlign: "center",
    marginTop: 24,
    borderTop: "1px solid #eaeaea",
    background: "#fff",
  };

  const navStyle: React.CSSProperties = {
    display: "flex",
    gap: 12,
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 8,
  };

  const smallStyle: React.CSSProperties = {
    marginTop: 8,
    fontSize: 12,
    color: "#666",
  };

  const linkStyle: React.CSSProperties = {
    color: "inherit",
    textDecoration: "none",
  };

  // ekran-okuyucu gizli metin stili (inline, global css yoksa çalışır)
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

  // JSON-LD organization structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: supportEmail,
        contactType: "customer support",
      },
    ],
  };

  // WhatsApp contact (env'den okunur). Eğer .env yoksa buton yine çalışır ama link genel wa.me/ adresine gider.
  const whatsappNumberRaw =
    (import.meta as any).env?.VITE_WHATSAPP_NUMBER ??
    (import.meta as any).env?.VITE_SUPPORT_PHONE ??
    "";
  const whatsappNumberDigits = whatsappNumberRaw.replace(/\D/g, "");
  const whatsappLink = whatsappNumberDigits ? `https://wa.me/${whatsappNumberDigits}` : "https://wa.me/";

  const whatsappButtonStyle: React.CSSProperties = {
    position: "fixed",
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    background: "#25D366",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    textDecoration: "none",
    boxShadow: "0 6px 18px rgba(37,211,102,0.3)",
    zIndex: 9999,
  };

  const whatsappSvgStyle: React.CSSProperties = {
    width: 28,
    height: 28,
    fill: "currentColor",
  };

  return (
    <footer role="contentinfo" style={footerStyle}>
      {/* Erişilebilirlik: ekran okuyucular için kısa açıklama (görünmez) */}
      <span style={srOnly}>{`${siteName} iletişim: ${supportEmail}`}</span>

      <nav aria-label="footer" style={navStyle}>
        <Link
          to="/privacy-policy"
          style={linkStyle}
          aria-label="Gizlilik Politikası sayfasına git"
          data-testid="footer-privacy"
        >
          Gizlilik Politikası
        </Link>

        <Link
          to="/terms"
          style={linkStyle}
          aria-label="Kullanım Şartları sayfasına git"
          data-testid="footer-terms"
        >
          Kullanım Şartları
        </Link>

        <a
          href={`mailto:${supportEmail}`}
          style={linkStyle}
          aria-label={`E-posta ile iletişim: ${supportEmail}`}
          data-testid="footer-contact"
        >
          İletişim
        </a>
      </nav>

      <div style={smallStyle}>
        © {year} {siteName} · Tüm hakları saklıdır.
      </div>

      {/* JSON-LD yapılandırma (arama motorları için) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* WhatsApp floating button - erişilebilir ve yeni sekmede açar */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`WhatsApp ile iletişim ${whatsappNumberRaw ? whatsappNumberRaw : ""}`}
        title={whatsappNumberRaw ? `WhatsApp: ${whatsappNumberRaw}` : "WhatsApp"}
        data-testid="footer-whatsapp"
        style={whatsappButtonStyle}
      >
        {/* WhatsApp SVG icon */}
        <svg viewBox="0 0 24 24" style={whatsappSvgStyle} aria-hidden="true" focusable="false">
          <path d="M20.52 3.48A11.9 11.9 0 0012 0C5.373 0 0 5.373 0 12a11.9 11.9 0 001.67 6.01L0 24l6.3-1.59A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12 0-3.2-1.25-6.2-3.48-8.52zM12 22.08c-1.7 0-3.36-.44-4.82-1.27l-.34-.2-3.74.94.99-3.64-.21-.37A9.06 9.06 0 012.92 12 9.08 9.08 0 1112 21.99zM17.1 14.37c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15s-.78.98-.95 1.18c-.17.2-.34.23-.64.08-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.79-1.67-2.09-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.28.3-.47.1-.2 0-.37-.05-.52-.05-.15-.68-1.65-.93-2.27-.24-.6-.49-.52-.68-.53l-.58-.01c-.2 0-.52.07-.79.37-.27.3-1.03 1.01-1.03 2.47 0 1.46 1.05 2.87 1.2 3.07.15.2 2.08 3.36 5.04 4.71 2.96 1.35 2.96.9 3.5.85.54-.05 1.78-.72 2.03-1.41.25-.69.25-1.28.17-1.41-.08-.13-.28-.2-.58-.35z" />
        </svg>
      </a>
    </footer>
  );
};

export default Footer;
