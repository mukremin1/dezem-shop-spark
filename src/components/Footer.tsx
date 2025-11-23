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
    </footer>
  );
};

export default Footer;
