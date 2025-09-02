import { FiFileText, FiFilm, FiFolder, FiTrash2 } from "react-icons/fi";
import { useFiles } from "../context/FileContext.jsx";

function iconFor(item) {
  if (item.type === "folder") return <FiFolder size={22} />;
  if ((item.contentType || "").startsWith("video/")) return <FiFilm size={22} />;
  if ((item.contentType || "") === "application/pdf") return <FiFileText size={22} />;
  return <FiFileText size={22} />;
}

export default function FileGrid({ items }) {
  const { deleteItem, openItem } = useFiles();

  const formatSize = (bytes) => {
    if (!bytes) return "0 B";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleDelete = (e, item) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm("Bu öğeyi silmek istediğinizden emin misiniz?")) {
      deleteItem(item);
    }
  };

  return (
    <div className="grid">
      {items.map(it => (
        <div
          key={`${it.type}-${it.id}`}
          className="card"
          onClick={() => openItem(it)} // 🔑 tüm item objesi gönderiliyor
        >
          <div className="icon">{iconFor(it)}</div>
          <div className="name">{it.name}</div>
          <div className="meta">
            {it.type === "file"
              ? `${it.contentType?.split("/")[1] || "dosya"} · ${formatSize(it.size)}`
              : "Klasör"}
          </div>
          <button
            className="delete-btn"
            onClick={(e) => handleDelete(e, it)}
            title="Sil"
          >
            <FiTrash2 />
          </button>
        </div>
      ))}
    </div>
  );
}
