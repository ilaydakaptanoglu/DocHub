import { FiFileText, FiFilm, FiFolder, FiTrash2 } from "react-icons/fi";
import { useFiles } from "../context/FileContext.jsx";

function iconFor(item) {
  if (item.type === "folder") return <FiFolder />;
  if ((item.contentType || "").startsWith("video/")) return <FiFilm />;
  if ((item.contentType || "") === "application/pdf") return <FiFileText />;
  return <FiFileText />;
}

export default function FileList({ items }) {
  const { deleteItem, openItem, formatSize } = useFiles();

  const handleDelete = (e, item) => {
    e.stopPropagation();
    if (window.confirm("Bu öğeyi silmek istediğine emin misin?")) {
      deleteItem(item);
    }
  };

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
        {items.map(item => (
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
