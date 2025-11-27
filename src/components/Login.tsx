import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setIsError(false);

    try {
      // Modern Supabase auth API with fallback for older versions
      if (supabase?.auth && typeof supabase.auth.signInWithPassword === "function") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setMessage(error.message);
          setIsError(true);
          return;
        }
      } else if (supabase?.auth && typeof (supabase.auth as any).signIn === "function") {
        const { error } = await (supabase.auth as any).signIn({ email, password });
        if (error) {
          setMessage(error.message);
          setIsError(true);
          return;
        }
      } else {
        throw new Error("Authentication method not available.");
      }

      setMessage("Giriş başarılı. Yönlendiriliyorsunuz...");
      setIsError(false);
      setTimeout(() => navigate("/dashboard"), 400);
    } catch (err: any) {
      setMessage(err?.message || "Giriş sırasında hata oluştu.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "24px auto", padding: 20 }}>
      <div style={{ background: "#fff", border: "1px solid #f1f1f1", borderRadius: 12, boxShadow: "0 6px 18px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <div style={{ padding: 28 }}>
          <h2 style={{ margin: 0, fontSize: 22, color: "#ff6a00", fontWeight: 700 }}>Dezemu'ya Giriş Yap</h2>
          <p style={{ marginTop: 8, color: "#6b7280" }}>Hesabınıza erişmek için e-posta ve şifrenizi girin.</p>

          {message && (
            <div
              role="alert"
              aria-live="assertive"
              style={{
                marginTop: 16,
                padding: "10px 12px",
                borderRadius: 8,
                border: isError ? "1px solid #FECACA" : "1px solid #D1FAE5",
                background: isError ? "#FFF1F2" : "#ECFDF5",
                color: isError ? "#991B1B" : "#065F46",
              }}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ marginTop: 16 }}>
            <label style={{ display: "block", marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: "#374151", marginBottom: 6 }}>E-posta</div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid #E5E7EB",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                aria-label="E-posta"
              />
            </label>

            <label style={{ display: "block", marginBottom: 8, position: "relative" }}>
              <div style={{ fontSize: 13, color: "#374151", marginBottom: 6 }}>Şifre</div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                required
                placeholder="Şifreniz"
                style={{
                  width: "100%",
                  padding: "10px 40px 10px 12px",
                  borderRadius: 8,
                  border: "1px solid #E5E7EB",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                aria-label="Şifre"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: 34,
                  border: "none",
                  background: "transparent",
                  color: "#6B7280",
                  cursor: "pointer",
                }}
                aria-pressed={showPassword}
                aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
              >
                {showPassword ? "Gizle" : "Göster"}
              </button>
            </label>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
              <Link to="/forgot-password" style={{ color: "#FF6A00", textDecoration: "none", fontWeight: 600 }}>
                Şifremi unuttum
              </Link>

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: "#FF6A00",
                  color: "#fff",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: 10,
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 6px 14px rgba(255,106,0,0.18)",
                }}
                aria-busy={loading}
              >
                {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </button>
            </div>
          </form>

          <div style={{ marginTop: 18, textAlign: "center", color: "#6B7280" }}>
            Hesabınız yok mu?{" "}
            <Link to="/signup" style={{ color: "#FF6A00", fontWeight: 700, textDecoration: "none" }}>
              Kayıt Ol
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
