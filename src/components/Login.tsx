import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Giriş başarılı.");
        setTimeout(() => navigate("/dashboard"), 400);
      }
    } catch (err: any) {
      setMessage(err.message || "Giriş sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSendReset(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setForgotLoading(true);
    setForgotMsg(null);
    try {
      // Try Supabase v2 method, fallback to legacy api.resetPasswordForEmail if present.
      // @ts-ignore
      const res = await supabase.auth.resetPasswordForEmail?.(email) ?? await supabase.auth.api?.resetPasswordForEmail?.(email);
      if (res && (res as any).error) {
        setForgotMsg((res as any).error.message || "Şifre sıfırlama isteği gönderilirken bir hata oluştu.");
      } else {
        setForgotMsg("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Gelen kutunuzu kontrol edin.");
      }
    } catch (err: any) {
      setForgotMsg(err.message || "Şifre sıfırlama isteği gönderilemedi.");
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: 16 }}>
      <h2>Giriş Yap</h2>

      {!forgotMode ? (
        <form onSubmit={handleLogin}>
          <label style={{ display: "block", marginBottom: 8 }}>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              autoComplete="email"
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>

          <label style={{ display: "block", marginBottom: 8 }}>
            Şifre
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              autoComplete="current-password"
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            style={{
              padding: "10px 16px",
              width: "100%",
              background: loading ? "#ffb58a" : "#ff6a00",
              color: "#ffffff",
              border: "none",
              borderRadius: 8,
              marginTop: 12,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 6px 12px rgba(255,106,0,0.18)",
              transition: "background 150ms ease",
            }}
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSendReset}>
          <p style={{ marginBottom: 8 }}>
            Şifrenizi sıfırlamak için lütfen kayıtlı e-posta adresinizi girin. Size şifre sıfırlama bağlantısı e-posta ile gönderilecektir.
          </p>

          <label style={{ display: "block", marginBottom: 8 }}>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              autoComplete="email"
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>

          <button
            type="submit"
            disabled={forgotLoading}
            aria-busy={forgotLoading}
            style={{
              padding: "10px 16px",
              width: "100%",
              background: forgotLoading ? "#a6f0c1" : "#25D366",
              color: "#ffffff",
              border: "none",
              borderRadius: 8,
              marginTop: 12,
              fontWeight: 700,
              cursor: forgotLoading ? "not-allowed" : "pointer",
              boxShadow: "0 6px 12px rgba(37,211,102,0.18)",
              transition: "background 150ms ease",
            }}
          >
            {forgotLoading ? "Gönderiliyor..." : "Şifre Sıfırlama Bağlantısı Gönder"}
          </button>
        </form>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
        <button
          onClick={() => {
            setForgotMode((s) => !s);
            setMessage(null);
            setForgotMsg(null);
          }}
          style={{ background: "none", border: "none", color: "#111827", textDecoration: "underline", cursor: "pointer", padding: 0 }}
          aria-pressed={forgotMode}
        >
          {forgotMode ? "Geri dön" : "Şifremi unuttum"}
        </button>

        <div style={{ fontSize: 14 }}>
          Hesabınız yok mu?{" "}
          <Link
            to="/signup"
            style={{
              background: "#ff6a00",
              color: "#fff",
              padding: "6px 10px",
              borderRadius: 6,
              textDecoration: "none",
              fontWeight: 700,
              marginLeft: 8,
            }}
            aria-label="Kayıt ol"
          >
            Kayıt Ol
          </Link>
        </div>
      </div>

      {message && <p style={{ marginTop: 12 }}>{message}</p>}
      {forgotMsg && <p style={{ marginTop: 12 }}>{forgotMsg}</p>}
    </div>
  );
}
