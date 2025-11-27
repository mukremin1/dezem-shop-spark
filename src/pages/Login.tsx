import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import "@/styles/trendyol-theme.css";
import "@/styles/login-prominent.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"error" | "info" | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setMessageType(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
        setMessageType("error");
      } else if (data?.user) {
        setMessage("Giriş başarılı. Yönlendiriliyorsunuz...");
        setMessageType("info");
        setTimeout(() => navigate("/"), 600);
      } else {
        setMessage("Giriş isteği işlendi. Lütfen e-posta kutunuzu kontrol edin.");
        setMessageType("info");
      }
    } catch (err: any) {
      setMessage(err?.message || "Giriş sırasında hata oluştu.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    setMessage(null);
    setMessageType(null);
    if (!email) {
      setMessage("Şifre sıfırlamak için lütfen önce e-posta girin.");
      setMessageType("error");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset-success",
      });
      if (error) {
        setMessage(error.message || "Şifre sıfırlama isteği gönderilemedi.");
        setMessageType("error");
      } else {
        setMessage("Şifre sıfırlama e-postası gönderildi. Gelen kutunuzu kontrol edin.");
        setMessageType("info");
      }
    } catch (err: any) {
      setMessage(err?.message || "İşlem sırasında hata oluştu.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-hero" role="main" aria-labelledby="login-hero-title">
      <div className="login-container">
        <aside className="login-aside" aria-hidden>
          <div className="aside-inner">
            <h2 className="aside-title">Hesabınıza Hızlıca Giriş Yapın</h2>
            <p className="aside-lead">Güvenli ve hızlı. Siparişleriniz, favorileriniz ve profilinize kolay erişim.</p>
            <ul className="aside-features">
              <li>Hızlı ödeme</li>
              <li>Favorilere kaydetme</li>
              <li>Sipariş takibi</li>
            </ul>
          </div>
        </aside>

        <section className="login-card" role="region" aria-label="Giriş Formu">
          <header className="card-head">
            <h1 id="login-hero-title">Giriş Yap</h1>
            <p className="card-sub">E-posta ve parolanızla hesabınıza erişin</p>
          </header>

          <form className="card-form" onSubmit={handleLogin} noValidate>
            {message && (
              <div
                className={messageType === "error" ? "auth-alert error" : "auth-alert info"}
                role="status"
                aria-live="polite"
              >
                {message}
              </div>
            )}

            <label className="field">
              <span className="field-label">E-posta</span>
              <input
                className="field-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@eposta.com"
                required
                autoComplete="email"
              />
            </label>

            <label className="field">
              <div className="field-label-row">
                <span className="field-label">Parola</span>
                <button
                  type="button"
                  className="link-reset"
                  onClick={handleResetPassword}
                  aria-label="Şifremi unuttum"
                >
                  Şifremi unuttum
                </button>
              </div>
              <input
                className="field-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parolanız"
                required
                autoComplete="current-password"
              />
            </label>

            <div className="card-actions">
              <button
                type="submit"
                className="btn btn-primary btn-xl"
                disabled={loading}
                aria-disabled={loading}
              >
                {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </button>

              <Link to="/register" className="btn btn-outline btn-xl" aria-label="Kayıt Ol">
                Kayıt Ol
              </Link>
            </div>
          </form>

          <footer className="card-foot">
            <p>İlk defa mı geliyorsunuz? <Link to="/register">Hemen kaydolun</Link>.</p>
          </footer>
        </section>
      </div>
    </main>
  );
}
