import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register, loading } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState(""); // Yeni alan
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPass) { // Frontend validation
      setError("Parolalar eşleşmiyor!");
      return;
    }

    try {
      await register(name.trim(), email.trim(), password, confirmPass); // ConfirmPassword gönderiliyor
      nav("/files");
    } catch (err) {
      setError("Kayıt başarısız: " + (err?.message || "Hata"));
    }
  };

  return (
    <div className="panel" style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2 style={{ marginBottom: 12 }}>Kayıt Ol</h2>
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      <form onSubmit={onSubmit} className="form">
        <label className="label">
          Ad Soyad
          <input className="input" value={name}
                 onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className="label">
          E-posta
          <input className="input" type="email" value={email}
                 onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="label">
          Şifre
          <input className="input" type="password" value={password}
                 onChange={(e) => setPass(e.target.value)} required />
        </label>
        <label className="label">
          Şifreyi Onayla
          <input className="input" type="password" value={confirmPass}
                 onChange={(e) => setConfirmPass(e.target.value)} required />
        </label>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Kayıt olunuyor..." : "Kayıt Ol"}
        </button>
      </form>
      <div style={{ marginTop: 12, color: "var(--sub)" }}>
        Zaten üye misin? <Link to="/login">Giriş yap</Link>
      </div>
    </div>
  );
}
