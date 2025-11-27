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

  const contactStyle: React.CSSProperties = {
    marginTop: 8,
    fontSize: 14,
    color: "#333",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    alignItems: "center",
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
  const jsonLd: any = {
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

  // Görüntülenecek iletişim bilgileri (sabit olarak gösterilecek)
  const displayedPhone = "05395263293";
  const displayedAddress = "Palandöken/Erzurum";

  // WhatsApp numarasını env'den oku yoksa görüntülenen numarayı kullan
  const whatsappNumberRaw =
    (import.meta as any).env?.VITE_WHATSAPP_NUMBER ??
    (import.meta as any).env?.VITE_SUPPORT_PHONE ??
    displayedPhone;

  // Sadece rakamları al
  const digitsOnly = (whatsappNumberRaw || "").replace(/\D/g, "");

  // wa.me için ülke kodlu E.164 formatında (başında + olmadan) hazırla
  let whatsappNumberForWa = digitsOnly;
  if (whatsappNumberForWa.startsWith("0")) {
    whatsappNumberForWa = "90" + whatsappNumberForWa.substring(1);
  } else if (whatsappNumberForWa.startsWith("+")) {
    whatsappNumberForWa = whatsappNumberForWa.replace(/^\+/, "");
  }

  const whatsappLink = whatsappNumberForWa ? `https://wa.me/${whatsappNumberForWa}` : "https://wa.me/";

  // JSON-LD'ye telefon ve adres ekle (varsa)
  if (whatsappNumberForWa) {
    jsonLd.contactPoint.push({
      "@type": "ContactPoint",
      telephone: `+${whatsappNumberForWa}`,
      contactType: "customer support",
    });
    jsonLd.address = {
      "@type": "PostalAddress",
      streetAddress: displayedAddress,
    };
  }

  // -- Terms modal state & refs --
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
      // focus close button when modal opens
      setTimeout(() => closeButtonRef.current?.focus(), 0);
      document.addEventListener("keydown", onKey);
      // prevent background scrolling
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = prevOverflow;
        previousActiveElementRef.current?.focus();
      };
    }
    // cleanup when not open
    return () => {};
  }, [termsOpen]);

  // Terms metni (kısa sürüm)
  const termsContent = (
    <>
      <h2 id="terms-title" style={{ marginTop: 0 }}>
        Kullanım Şartları
      </h2>

      <section aria-labelledby="terms-intro">
        <h3 id="terms-intro" style={{ marginBottom: 4 }}>1. Giriş</h3>
        <p style={{ marginTop: 0 }}>
          Bu Kullanım Şartları ("Şartlar"), {siteName} tarafından sunulan
          web sitesinin ve hizmetlerinin ("Hizmet") kullanımına ilişkin koşulları
          belirler. Hizmeti kullanarak bu Şartları kabul etmiş olursunuz.
        </p>
      </section>

      <section aria-labelledby="terms-service">
        <h3 id="terms-service" style={{ marginBottom: 4 }}>2. Hizmetin Kapsamı</h3>
        <p style={{ marginTop: 0 }}>
          {siteName}, ürün gösterimi, sipariş alma ve destek sağlama amaçlı
          çevrimiçi hizmetler sunar. Hizmet içerikleri önceden haber verilmeksizin
          güncellenebilir, değiştirilebilir veya durdurulabilir.
        </p>
      </section>

      <section aria-labelledby="terms-contact">
        <h3 id="terms-contact" style={{ marginBottom: 4 }}>İletişim Bilgileri</h3>
        <p style={{ marginTop: 0 }}>
          Telefon: <a href={whatsappLink} target="_blank" rel="noopener noreferrer">05395263293</a><br />
          Adres: Palandöken/Erzurum<br />
          E-posta: <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
        </p>
      </section>

      <p style={{ fontSize: 12, color: "#666" }}>
        Son güncelleme: {new Date().toLocaleDateString()}
      </p>
    </>
  );

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

          {/* Kullanım Şartları linki tıklandığında modal açar */}
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

        {/* Görünen iletişim bilgileri */}
        <div style={contactStyle} aria-label="İletişim bilgileri">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "none", fontWeight: 500 }}
            aria-label={`WhatsApp ile iletişim ${displayedPhone}`}
            title={`WhatsApp: ${displayedPhone}`}
            data-testid="footer-phone"
          >
            {displayedPhone}
          </a>
          <div aria-hidden="false" style={{ color: "#666" }}>
            {displayedAddress}
          </div>
          <a
            href={`mailto:${supportEmail}`}
            style={{ color: "inherit", textDecoration: "none" }}
            aria-label={`E-posta ile iletişim ${supportEmail}`}
            data-testid="footer-email"
          >
            {supportEmail}
          </a>
        </div>

        <div style={smallStyle}>
          © {year} {siteName} · Tüm hakları saklıdır.
        </div>

        {/* JSON-LD yapılandırma (arama motorları için) */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </footer>

      {/* WhatsApp floating button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`WhatsApp ile iletişim ${displayedPhone}`}
        title={`WhatsApp: ${displayedPhone}`}
        data-testid="footer-whatsapp"
        style={whatsappButtonStyle}
      >
        <svg viewBox="0 0 24 24" style={whatsappSvgStyle} aria-hidden="true" focusable="false">
          <path d="M20.52 3.48A11.9 11.9 0 0012 0C5.373 0 0 5.373 0 12a11.9 11.9 0 001.67 6.01L0 24l6.3-1.59A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12 0-3.2-1.25-6.2-3.48-8.52zM12 22.08c-1.7 0-3.36-.44-4.82-1.27l-.34-.2-3.74.94.99-3.64-.21-.37A9.06 9.06 0 012.92 12 9.08 9.08 0 1112 21.99zM17.1 14.37c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15s-.78.98-.95 1.18c-.17.2-.34.23-.64.08-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.79-1.67-2.09-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.28.3-.47.1-.2 0-.37-.05-.52-.05-.15-.68-1.65-.93-2.27-.24-.6-.49-.52-.68-.53l-.58-.01c-.2 0-.52.07-.79.37-.27.3-1.03 1.01-1.03 2.47 0 1.46 1.05 2.87 1.2 3.07.15.2 2.08 3.36 5.04 4.71 2.96 1.35 2.96.9 3.5.85.54-.05 1.78-.72 2.03-1.41.25-.69.25-1.28.17-1.41-.08-.13-.28-.2-.58-.35z" />
        </svg>
      </a>

      {/* Terms Modal */}
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
          onClick={() => setTermsOpen(false)} // overlay click closes
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
            onClick={(e) => e.stopPropagation()} // modal içi tıklama overlay kapatmayı engeller
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
                <h2 id="terms-title" style={{ margin: 0 }}>
                  Kullanım Şartları
                </h2>
                <span style={{ color: "#666", fontSize: 14, marginLeft: 8 }}>
                  {siteName}
                </span>
              </div>
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
