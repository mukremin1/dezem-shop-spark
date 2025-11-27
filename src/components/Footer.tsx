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

  // Terms text (Türkçe). Gerektiğinde daha ayrıntılı hale getirebilirsin.
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

      <section aria-labelledby="terms-user">
        <h3 id="terms-user" style={{ marginBottom: 4 }}>3. Kullanıcı Yükümlülükleri</h3>
        <p style={{ marginTop: 0 }}>
          Kullanıcılar doğru ve güncel bilgi sağlamakla yükümlüdür. Hesap,
          kimlik veya iletişim bilgilerinin güvenliğini sağlamak kullanıcı sorumluluğundadır.
        </p>
      </section>

      <section aria-labelledby="terms-prohibited">
        <h3 id="terms-prohibited" style={{ marginBottom: 4 }}>4. Yasaklanan Kullanımlar</h3>
        <p style={{ marginTop: 0 }}>
          Hizmeti yasa dışı faaliyetler, kötü amaçlı yazılımlar, hileli işlemler
          veya üçüncü taraf haklarını ihlal edecek şekilde kullanmak yasaktır.
        </p>
      </section>

      <section aria-labelledby="terms-ip">
        <h3 id="terms-ip" style={{ marginBottom: 4 }}>5. Fikri Mülkiyet</h3>
        <p style={{ marginTop: 0 }}>
          Sitede yer alan içerik, görseller ve yazılımlar {siteName} veya lisans verenlerine
          aittir. İzin alınmadan çoğaltılamaz veya tekrar dağıtılamaz.
        </p>
      </section>

      <section aria-labelledby="terms-liability">
        <h3 id="terms-liability" style={{ marginBottom: 4 }}>6. Sorumluluk Sınırı</h3>
        <p style={{ marginTop: 0 }}>
          Hizmetin kesintisiz, hatasız veya belirli bir amaca uygun olacağına dair garanti verilmez.
          {siteName}in sorumluluğu kanunen izin verilen en geniş kapsamda sınırlıdır.
        </p>
      </section>

      <section aria-labelledby="terms-changes">
        <h3 id="terms-changes" style={{ marginBottom: 4 }}>7. Değişiklikler</h3>
        <p style={{ marginTop: 0 }}>
          Bu Şartlar zaman zaman güncellenebilir. Önemli değişiklikler yayınlandığında
          kullanıcılar bilgilendirilecektir; güncellemeler yayım tarihinde yürürlüğe girer.
        </p>
      </section>

      <section aria-labelledby="terms-contact">
        <h3 id="terms-contact" style={{ marginBottom: 4 }}>8. İletişim</h3>
        <p style={{ marginTop: 0 }}>
          Herhangi bir soru veya talep için: <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
        </p>
      </section>

      <p style={{ fontSize: 12, color: "#666" }}>
        Son güncelleme: {new Date().toLocaleDateString()}
      </p>
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

          {/* Kullanım Şartları linki tıklandığında modal açar */}
          <Link
            to="/terms"
            style={linkStyle}
            aria-label="Kullanım Şartları sayfasına git"
            data-testid="footer-terms"
            onClick={(e) => {
              // açılır pencere/modal göster; varsayılan gezinmeyi engelle
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

        {/* JSON-LD yapılandırma (arama motorları için) */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </footer>

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
