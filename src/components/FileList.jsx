import { FiFileText, FiFilm, FiFolder, FiTrash2 } from "react-icons/fi";
import { useFiles } from "../context/FileContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

// Dosya türüne göre icon
function iconFor(item) {
  if (item.type === "folder") return <FiFolder />;
  if ((item.contentType || "").startsWith("video/")) return <FiFilm />;
  if ((item.contentType || "") === "application/pdf") return <FiFileText />;
  return <FiFileText />;
}

export default function FileList({ items }) {
  const { deleteItem, openItem, formatSize } = useFiles();
  const { user, isAdmin } = useAuth(); // user ve admin kontrolü

  const currentUserId = user?.Id || user?.id || null;

  // Silme işlemi
  const handleDelete = (e, item) => {
    e.stopPropagation();
    if (window.confirm("Bu öğeyi silmek istediğine emin misin?")) {
      deleteItem(item);
    }
  };

  // Admin tüm dosyaları görür, normal kullanıcı sadece kendi dosyalarını
  const filteredItems = isAdmin
    ? items
    : items.filter(item => item.userId === currentUserId);

  return (
    <table className="list">
      <thead>
        <tr>
          <th></th>
          <th>Ad</th>
          <th>Tür</th>
          <th>Boyut</th>
          <th>Sil</th>
        </tr>
      </thead>
      <tbody>
        {filteredItems.map(item => (
          <tr key={`${item.type}-${item.id}`} onClick={() => openItem(item)}>
            <td>{iconFor(item)}</td>
            <td>{item.name}</td>
            <td>{item.type === "folder" ? "Klasör" : item.contentType || "Dosya"}</td>
            <td>{item.type === "file" ? formatSize(item.size) : "-"}</td>
            <td>
              <button
                className="delete-btn"
                onClick={(e) => handleDelete(e, item)}
              >
                <FiTrash2 />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
