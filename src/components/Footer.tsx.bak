import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const siteName = (import.meta as any).env?.VITE_SITE_NAME ?? "Dezemu";
  const supportEmail = (import.meta as any).env?.VITE_SUPPORT_EMAIL ?? "destek@dezemu.com";
  const siteUrl = (import.meta as any).env?.VITE_SITE_URL ?? "https://dezemu.com/";
  const year = new Date().getFullYear();

  // İletişim bilgileri
  const address = "Palandöken / Erzurum";
  const phone = "+90 539 526 3293";
  const whatsappPhone = "905395263293"; // wa.me expects no plus or spaces
  const whatsappText = encodeURIComponent("Merhaba Dezemu, ürünler hakkında bilgi almak istiyorum.");

  // Kısa kullanım şartları özeti (footer için)
  const termsSummary =
    "Dezemu üzerinde yapılan tüm alışverişler ve kullanıcı etkileşimleri için geçerli genel kullanım kuralları. Ürün açıklamalarına ve ödeme koşullarına dikkat ediniz. İade, değişim ve garanti koşulları ürün sayfasında belirtilmiştir.";

  // Hakkımızda metni
  const aboutText =
    "Dezemu, kaliteli ürünleri uygun fiyatlarla sunmayı hedefleyen yerel e-ticaret girişimidir. Müşteri memnuniyeti ve güvenilir destek hizmeti odaklı çalışıyoruz. Yerel tedarikçilerle iş birliği yaparak geniş ürün yelpazesi sunuyoruz.";

  const [showTerms, setShowTerms] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const footerStyle: React.CSSProperties = {
    padding: 20,
    background: "#ffffff",
    borderTop: "1px solid #eaeaea",
    marginTop: 32,
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 16px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  };

  const topRowStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "flex-start",
  };

  const navStyle: React.CSSProperties = {
    display: "flex",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
  };

  const contactBoxStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    minWidth: 240,
    background: "#fffdf8",
    padding: 12,
    borderRadius: 8,
    border: "1px solid #fff1e6",
  };

  const contactLineStyle: React.CSSProperties = {
    fontSize: 14,
    color: "#111827",
  };

  const smallStyle: React.CSSProperties = {
    color: "#6b7280",
    fontSize: 13,
  };

  const linkStyle: React.CSSProperties = {
    color: "#111827",
    textDecoration: "none",
    fontWeight: 600,
  };

  const buttonLinkStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    padding: 0,
    margin: 0,
    cursor: "pointer",
    color: "#111827",
    fontWeight: 600,
  };

  const highlightStyle: React.CSSProperties = {
    color: "#ff6a00",
    fontWeight: 700,
    textDecoration: "none",
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
    <>
      <footer role="contentinfo" style={footerStyle}>
        <div style={containerStyle}>
          <span style={srOnly}>{`${siteName} iletişim: ${supportEmail}, ${phone}, ${address}`}</span>

          <div style={topRowStyle}>
            <div style={{ minWidth: 300 }}>
              <nav aria-label="footer-links" style={navStyle}>
                <Link to="/privacy-policy" style={linkStyle} aria-label="Gizlilik Politikası">
                  Gizlilik Politikası
                </Link>

                <button
                  type="button"
                  onClick={() => setShowTerms((s) => !s)}
                  aria-expanded={showTerms}
                  aria-controls="footer-terms-summary"
                  style={buttonLinkStyle}
                >
                  Kullanım Şartları
                </button>

                <button
                  type="button"
                  onClick={() => setShowAbout((s) => !s)}
                  aria-expanded={showAbout}
                  aria-controls="footer-about"
                  style={buttonLinkStyle}
                >
                  Hakkımızda
                </button>

                <a href={`mailto:${supportEmail}`} style={linkStyle} aria-label="E-posta ile iletişim">
                  İletişim
                </a>
              </nav>

              <div
                id="footer-terms-summary"
                aria-hidden={!showTerms}
                style={{ marginTop: 10, maxWidth: 640, display: showTerms ? "block" : "none" }}
              >
                <h4 style={{ margin: "8px 0", fontSize: 15 }}>Kullanım Şartları (Kısa Özet)</h4>
                <p style={{ margin: 0, color: "#374151", fontSize: 13 }}>{termsSummary}</p>
                <p style={{ marginTop: 8, fontSize: 13 }}>
                  Daha detaylı bilgi için <Link to="/terms" style={highlightStyle}>tam metni görüntüleyin</Link>.
                </p>
              </div>
            </div>

            {/* İletişim kutusu — ayrı ve dolu olarak gösteriliyor */}
            <aside style={contactBoxStyle} aria-label="İletişim bilgileri">
              <div style={{ fontWeight: 700, color: "#111827" }}>{address}</div>

              <div style={contactLineStyle}>
                Telefon:{" "}
                <a href={`tel:${phone.replace(/\s+/g, "")}`} style={highlightStyle} aria-label={`Telefon: ${phone}`}>
                  {phone}
                </a>
              </div>

              <div style={contactLineStyle}>
                WhatsApp:{" "}
                <a
                  href={`https://wa.me/${whatsappPhone}?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={highlightStyle}
                  aria-label="WhatsApp ile iletişim"
                >
                  +90 539 526 3293
                </a>
              </div>

              <div style={contactLineStyle}>
                E-posta:{" "}
                <a href={`mailto:${supportEmail}`} style={highlightStyle} aria-label={`E-posta: ${supportEmail}`}>
                  {supportEmail}
                </a>
              </div>

              <div style={{ marginTop: 8, color: "#6b7280", fontSize: 13 }}>
                Çalışma Saatleri: <span style={{ color: "#111827" }}>Pzt–Cuma: 09:00–18:00, Cmt: 10:00–16:00, Paz: Kapalı</span>
              </div>

              <div style={{ marginTop: 8, fontSize: 13, color: "#374151" }}>
                Destek için yukarıdaki numara/e-posta üzerinden veya WhatsApp üzerinden bize ulaşabilirsiniz. Genellikle 24 saat içinde dönüş yapıyoruz.
              </div>
            </aside>
          </div>

          <div
            id="footer-about"
            aria-hidden={!showAbout}
            style={{ marginTop: 18, paddingTop: 12, borderTop: "1px solid #f3f4f6", display: showAbout ? "block" : "none" }}
          >
            <h4 style={{ margin: "4px 0", fontSize: 15 }}>Hakkımızda</h4>
            <p style={{ margin: 0, color: "#374151", fontSize: 13 }}>{aboutText}</p>
          </div>

          <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={smallStyle}>© {year} {siteName} · Tüm hakları saklıdır.</div>
            <div style={smallStyle}>Geliştirme &amp; Destek: <a href={`mailto:${supportEmail}`} style={highlightStyle}>{supportEmail}</a></div>
          </div>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </footer>

      {/* Floating WhatsApp button (sağ alt köşe) */}
      <a
        href={`https://wa.me/${whatsappPhone}?text=${whatsappText}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp ile iletişim"
        title="WhatsApp ile iletişim"
        style={{
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
        }}
      >
        {/* WhatsApp SVG icon (simple, high-contrast) */}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden focusable="false" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.52 3.48A11.88 11.88 0 0012.06 0C5.42 0 .18 5.24.18 11.88c0 2.09.55 4.13 1.6 5.93L0 24l6.32-1.62A11.86 11.86 0 0012.06 24c6.64 0 11.88-5.24 11.88-11.88 0-3.18-1.24-6.17-3.42-8.64z" fill="#ffffff" opacity="0.06"/>
          <path d="M18.3 5.7a9.05 9.05 0 00-6.24-2.58c-5.02 0-9.1 4.08-9.1 9.1 0 1.6.42 3.14 1.22 4.5L3 21.6l4.02-1.06a9.06 9.06 0 004.04 0c4.06 0 7.88-2.48 9.1-6.08a9.05 9.05 0 00-2.86-8.83z" fill="#25D366"/>
          <path d="M16.1 14.1c-.22-.11-1.3-.64-1.5-.72-.2-.08-.35-.11-.5.11-.16.22-.62.72-.76.87-.14.16-.28.18-.5.07-.2-.11-.85-.31-1.62-.98-.6-.54-1.01-1.2-1.13-1.43-.12-.23-.01-.34.09-.45.09-.1.2-.28.3-.42.1-.14.14-.23.21-.38.07-.14.03-.27-.02-.38-.05-.11-.5-1.2-.68-1.64-.18-.43-.36-.37-.5-.38l-.42-.01c-.14 0-.36.05-.55.23-.19.18-.72.7-.72 1.7s.74 1.97.84 2.11c.1.14 1.45 2.22 3.52 3.12 2.07.9 2.07.6 2.45.56.38-.04 1.23-.5 1.4-1.01.17-.5.17-.93.12-1.02-.05-.09-.18-.14-.4-.24z" fill="#fff"/>
        </svg>
      </a>
    </>
  );
};

export default Footer;
