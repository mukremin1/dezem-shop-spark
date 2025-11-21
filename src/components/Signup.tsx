import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        // If you want to create a profile row immediately:
        // await supabase.from('profiles').insert([{ id: data.user?.id, email }]);
        setMessage("Kayıt başarılı. E‑postanızı kontrol edip onaylayın.");
        // Optional: redirect to login or to a verification/info page
        setTimeout(() => navigate("/login"), 1400);
      }
    } catch (err: any) {
      setMessage(err.message || "Kayıt sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 16 }}>
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleSignup}>
        <label style={{ display: "block", marginBottom: 8 }}>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
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
            minLength={6}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>
        <button type="submit" disabled={loading} style={{ padding: "8px 16px" }}>
          {loading ? "Bekleyin..." : "Kayıt Ol"}
        </button>
      </form>
      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </div>
  );
}
