import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const siteName = (import.meta as any).env?.VITE_SITE_NAME ?? "Dezemu";
  const supportEmail = (import.meta as any).env?.VITE_SUPPORT_EMAIL ?? "destek@dezemu.com";
  const siteUrl = (import.meta as any).env?.VITE_SITE_URL ?? "https://dezemu.com/";
  const year = new Date().getFullYear();

  // Yeni iletişim bilgileri
  const address = "Palandöken / Erzurum";
  const phone = "+90 539 526 3293";

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

  const contactStyle: React.CSSProperties = {
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    gap: 6,
    alignItems: "center",
    color: "#374151",
    fontSize: 14,
  };

  const smallStyle: React.CSSProperties = {
    marginTop: 12,
    fontSize: 12,
    color: "#666",
  };

  const linkStyle: React.CSSProperties = {
    color: "inherit",
    textDecoration: "none",
  };

  const highlightStyle: React.CSSProperties = {
    color: "#ff6a00",
    fontWeight: 600,
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

  // JSON-LD organization structured data (güncellendi: telefon ve adres eklendi)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: phone,
        email: supportEmail,
        contactType: "customer support",
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Palandöken",
      addressLocality: "Erzurum",
      addressCountry: "TR",
    },
  };

  return (
    <footer role="contentinfo" style={footerStyle}>
      {/* Erişilebilirlik: ekran okuyucular için kısa açıklama (görünmez) */}
      <span style={srOnly}>{`${siteName} iletişim: ${supportEmail}, ${phone}, ${address}`}</span>

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

      {/* Görsel iletişim bloğu — sayfanın altında net şekilde gösterilir */}
      <div style={contactStyle} aria-label="İletişim bilgileri">
        <div style={{ fontWeight: 700, color: "#111827" }}>{address}</div>
        <div>
          <a href={`tel:${phone.replace(/\s+/g, "")}`} style={highlightStyle} aria-label={`Telefon: ${phone}`}>
            {phone}
          </a>
        </div>
        <div>
          <a href={`mailto:${supportEmail}`} style={highlightStyle} aria-label={`E-posta: ${supportEmail}`}>
            {supportEmail}
          </a>
        </div>
      </div>

      <div style={smallStyle}>
        © {year} {siteName} · Tüm hakları saklıdır.
      </div>

      {/* JSON-LD yapılandırma (arama motorları için) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </footer>
  );
};

export default Footer;
