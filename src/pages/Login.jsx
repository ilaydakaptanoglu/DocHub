import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login, loading } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email.trim(), password);
      nav("/files");
    } catch (err) {
      alert("Giriş başarısız: " + (err?.message || "Hata"));
    }
  };

  return (
    <div className="panel" style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2 style={{ marginBottom: 12 }}>Giriş Yap</h2>
      <form onSubmit={onSubmit} className="form">
        <label className="label">
          E-posta
          <input className="input" type="email" value={email}
                 onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="label">
          Şifre
          <input className="input" type="password" value={password}
                 onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
      <div style={{ marginTop: 12, color: "var(--sub)" }}>
        Hesabın yok mu? <Link to="/register">Kayıt ol</Link>
      </div>
    </div>
  );
}