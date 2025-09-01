import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register, loading } = useAuth();
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPass]     = useState("");
  const [confirmPassword, setConfirm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({
        Username: username.trim(),
        Email: email.trim(),
        Password: password,
        ConfirmPassword: confirmPassword,
        FirstName: firstName.trim(),
        LastName: lastName.trim()
      });
      nav("/files");
    } catch (err) {
      alert("Kayıt başarısız: " + (err?.message || "Hata"));
    }
  };

  return (
    <div className="panel" style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2 style={{ marginBottom: 12 }}>Kayıt Ol</h2>
      <form onSubmit={onSubmit} className="form">
        <label className="label">
          Kullanıcı Adı
          <input className="input" value={username} onChange={e => setUsername(e.target.value)} required />
        </label>
        <label className="label">
          E-posta
          <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label className="label">
          Ad
          <input className="input" value={firstName} onChange={e => setFirstName(e.target.value)} />
        </label>
        <label className="label">
          Soyad
          <input className="input" value={lastName} onChange={e => setLastName(e.target.value)} />
        </label>
        <label className="label">
          Şifre
          <input className="input" type="password" value={password} onChange={e => setPass(e.target.value)} required />
        </label>
        <label className="label">
          Şifreyi Onayla
          <input className="input" type="password" value={confirmPassword} onChange={e => setConfirm(e.target.value)} required />
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
