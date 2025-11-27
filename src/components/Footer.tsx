import React, { useEffect, useRef, useState } from "react";
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

  // -- Terms modal state & refs (kept simple and safe) --
  const [termsOpen, setTermsOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && termsOpen) {
        setTermsOpen(false);
      }
    }
    if (termsOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement | null;
      setTimeout(() => closeButtonRef.current?.focus(), 0);
      document.addEventListener("keydown", onKey);
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = prevOverflow;
        previousActiveElementRef.current?.focus();
      };
    }
    return () => {};
  }, [termsOpen]);

  const termsContent = (
    <>
      <h2 id="terms-title" style={{ marginTop: 0 }}>
        Kullanım Şartları
      </h2>
      <p>Bu Kullanım Şartları {siteName} için geçerlidir.</p>
      <p style={{ fontSize: 12, color: "#666" }}>Son güncelleme: {new Date().toLocaleDateString()}</p>
    </>
  );

  return (
    <>
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
            onClick={(e) => {
              e.preventDefault();
              setTermsOpen(true);
            }}
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

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </footer>

      {/* PaymentsBar ekleniyor; offsetFromBottom ile diğer sabit elemanlarla çakışma önlenebilir */}
      

      {/* Terms modal */}
      {termsOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="terms-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            background: "rgba(0,0,0,0.5)",
          }}
          onClick={() => setTermsOpen(false)}
        >
          <div
            role="document"
            style={{
              background: "#fff",
              color: "#111",
              maxWidth: 900,
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              borderRadius: 8,
              padding: 20,
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 id="terms-title" style={{ margin: 0 }}>
                Kullanım Şartları
              </h2>
              <button
                ref={closeButtonRef}
                onClick={() => setTermsOpen(false)}
                aria-label="Kullanım Şartları penceresini kapat"
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: 20,
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
            <div style={{ marginTop: 12, lineHeight: 1.6 }}>{termsContent}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;

