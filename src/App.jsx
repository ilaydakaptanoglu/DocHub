import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Explorer from "./pages/Explorer.jsx";
import { FileProvider } from "./context/FileContext.jsx";
import { FiFolder, FiHome, FiLogOut, FiUser } from "react-icons/fi";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function Sidebar() {
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const nav = useNavigate();
  const onLogout = () => { logout(); nav("/login"); };

  return (
    <aside className="sidebar">
      <div className="brand">DocHub</div>
      {isAuthenticated ? (
        <>
          <div style={{ color: "var(--text)", marginBottom: 10, display: "flex", gap: 8, alignItems: "center" }}>
            <FiUser /> <span>{user?.name || user?.email}</span>
            {isAdmin && (
              <span style={{ marginLeft: "auto", fontSize: 12, padding: "2px 8px",
                              border: "1px solid var(--border)", borderRadius: 999 }}>
                Admin
              </span>
            )}
          </div>
          <nav>
            <NavLink to="/" end className="nav" title="Home">
              <FiHome /> <span>Home</span>
            </NavLink>
            <NavLink to="/files" className="nav" title="Dosyalar">
              <FiFolder /> <span>Dosyalar</span>
            </NavLink>
          </nav>
          <button className="btn" style={{ marginTop: 12, width: "100%" }} onClick={onLogout}>
            <FiLogOut /> Çıkış Yap
          </button>
        </>
      ) : (
        <nav>
          <NavLink to="/login" className="nav" title="Giriş">
            <span>Giriş</span>
          </NavLink>
          <NavLink to="/register" className="nav" title="Kayıt">
            <span>Kayıt</span>
          </NavLink>
        </nav>
      )}
    </aside>
  );
}

export default function App() {
  return (
    <FileProvider>
      <div className="app">
        <Sidebar />
        <main className="main">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/files"
              element={
                <ProtectedRoute>
                  <Explorer />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </FileProvider>
  );
}
