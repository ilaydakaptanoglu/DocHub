import { FiFileText, FiFilm, FiFolder, FiTrash2 } from "react-icons/fi";
import { useFiles } from "../context/FileContext.jsx";

function iconFor(item){
  if (item.kind === "folder") return <FiFolder />;
  if ((item.mime||"").startsWith("video/")) return <FiFilm />;
  if ((item.mime||"") === "application/pdf") return <FiFileText />;
  return <FiFileText />;
}

export default function FileList({ items, onOpen }) {
  const { formatSize, deleteItem } = useFiles();

  const handleDelete = (e, id) => {
    e.stopPropagation(); // satırın click'ini durdur
    if (confirm("Bu öğeyi silmek istediğine emin misin?")) {
      deleteItem(id);
    }
  };

  return (
    <table className="list">
      <thead>
        <tr className="row">
          <th></th>
          <th>Ad</th>
          <th>Tür</th>
          <th>Boyut</th>
          <th>Sil</th>
        </tr>
      </thead>
      <tbody>
        {items.map(it => (
          <tr key={it.id} className="row" onClick={() => onOpen(it.id)}>
            <td>{iconFor(it)}</td>
            <td>{it.name}</td>
            <td>{it.kind === "folder" ? "Klasör" : (it.mime || "Dosya")}</td>
            <td>{it.kind === "file" ? formatSize(it.size) : "-"}</td>
            <td>
              <button className="delete-btn" onClick={(e) => handleDelete(e, it.id)}>
                <FiTrash2 />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
