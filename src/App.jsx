import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Explorer from "./pages/Explorer.jsx";
import { FileProvider } from "./context/FileContext.jsx";
import { FiFolder, FiHome } from "react-icons/fi";

export default function App() {
  return (
    <FileProvider>
      <div className="app">
        <aside className="sidebar">
          <div className="brand">DocHub</div>
          <nav>
            <NavLink to="/" end className="nav" title="Home">
              <FiHome /> <span>Home</span>
            </NavLink>
            <NavLink to="/files" className="nav" title="Dosyalar">
              <FiFolder /> <span>Dosyalar</span>
            </NavLink>
          </nav>
        </aside>
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/files" element={<Explorer />} />
          </Routes>
        </main>
      </div>
    </FileProvider>
  );
}