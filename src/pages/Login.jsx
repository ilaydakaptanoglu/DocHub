import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login, loading } = useAuth();
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPass] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // DTO ile uyumlu olarak login
      const user = await login(username.trim(), password);

      if (user) {
        // Admin ise tüm dosyalara erişim, user ise kendi dosyaları
        // Bu kontrol dosya fetch kısmında yapılacak
        nav("/files");
      }
    } catch (err) {
      alert("Giriş başarısız: " + (err?.message || "Hata"));
    }
  };

  return (
    <div className="panel" style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2 style={{ marginBottom: 12 }}>Giriş Yap</h2>
      <form onSubmit={onSubmit} className="form">
        <label className="label">
          Kullanıcı Adı
          <input
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label className="label">
          Şifre
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPass(e.target.value)}
            required
          />
        </label>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
      <div style={{ marginTop: 12, color: "var(--sub)" }}>
        Hesabın yok mu? <Link to="/register">Kayıt Ol</Link>
      </div>
    </div>
  );
}
