import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    marginTop: 6,
    marginBottom: 10,
    borderRadius: 8,
    border: "1px solid #dcdcdc",
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
  };

  const inputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).style.boxShadow = "0 0 0 4px rgba(99,102,241,0.08)";
    (e.target as HTMLInputElement).style.borderColor = "#6366f1";
  };
  const inputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).style.boxShadow = "";
    (e.target as HTMLInputElement).style.borderColor = "#dcdcdc";
  };

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    if (!email) {
      setError("E‑posta giriniz.");
      setLoading(false);
      return;
    }
    if (!password || password.length < 6) {
      setError("En az 6 karakterli bir şifre giriniz.");
      setLoading(false);
      return;
    }

    try {
      // Supabase v2: ikinci argüman olarak user metadata (data) gönderilebilir.
      // Eğer kullandığınız sürüm farklıysa, gerekli değişikliği yapın.
      const { data, error: signError } = await supabase.auth.signUp(
        { email, password },
        { data: { phone: phone || null } }
      );

      if (signError) {
        setError(signError.message);
      } else {
        setMessage("Kayıt başarılı. E‑postanızı kontrol edip onaylayın.");
        // isteğe bağlı: profil tablosuna ek bilgi yazmak isterseniz burada yapabilirsiniz
        // örn: await supabase.from('profiles').insert([{ id: data.user?.id, email, phone }]);
        setTimeout(() => navigate("/login"), 1400);
      }
    } catch (err: any) {
      setError(err?.message || "Kayıt sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "20px auto", padding: 18 }}>
      <h2 style={{ marginBottom: 8 }}>Kayıt Ol</h2>
      <p style={{ marginTop: 0, marginBottom: 12, color: "#444" }}>Hesap oluşturmak için bilgilerinizi girin.</p>

      <form onSubmit={handleSignup} aria-label="signup form" style={{ display: "grid", gap: 6 }}>
        <label style={{ display: "block", fontSize: 14 }}>
          E‑posta
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            aria-required
            placeholder="you@example.com"
            style={inputStyle}
            onFocus={inputFocus}
            onBlur={inputBlur}
            data-testid="signup-email"
          />
        </label>

        <label style={{ display: "block", fontSize: 14 }}>
          Telefon (opsiyonel)
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            placeholder="+90 5xx xxx xx xx"
            inputMode="tel"
            pattern="[\d\s()+-]+"
            aria-label="Telefon numarası (opsiyonel)"
            style={inputStyle}
            onFocus={inputFocus}
            onBlur={inputBlur}
            data-testid="signup-phone"
          />
        </label>

        <label style={{ display: "block", fontSize: 14 }}>
          Şifre
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            aria-required
            minLength={6}
            placeholder="En az 6 karakter"
            style={inputStyle}
            onFocus={inputFocus}
            onBlur={inputBlur}
            data-testid="signup-password"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 16px",
            background: "#6366f1",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 15,
            cursor: loading ? "default" : "pointer",
            opacity: loading ? 0.8 : 1,
            marginTop: 8,
          }}
          aria-disabled={loading}
          data-testid="signup-submit"
        >
          {loading ? "Bekleyin..." : "Kayıt Ol"}
        </button>
      </form>

      {error && (
        <div role="alert" style={{ color: "crimson", marginTop: 12 }}>
          {error}
        </div>
      )}
      {message && (
        <div role="status" style={{ color: "green", marginTop: 12 }}>
          {message}
        </div>
      )}
    </div>
  );
}
