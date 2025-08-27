import { FiFileText, FiFilm, FiFolder, FiTrash2 } from "react-icons/fi";
import { useFiles } from "../context/FileContext.jsx";

/**
 * Verilen öğe türüne göre uygun ikonu döndürür.
 * @param {object} item - Dosya veya klasör nesnesi.
 * @returns {JSX.Element} Icon bileşeni.
 */
function iconFor(item) {
  if (item.type === "folder") return <FiFolder size={22} />;
  if ((item.contentType || "").startsWith("video/")) return <FiFilm size={22} />;
  if ((item.contentType || "") === "application/pdf") return <FiFileText size={22} />;
  // Varsayılan olarak metin dosyası ikonu
  return <FiFileText size={22} />;
}

export default function FileGrid({ items }) {
  const { deleteItem, openItem } = useFiles(); // openItem'i de context'ten al

  /**
   * Dosya boyutunu okunabilir bir formatta biçimlendirir.
   * @param {number} bytes - Dosya boyutu (bayt cinsinden).
   * @returns {string} Biçimlendirilmiş boyut (örn. "1.23 MB").
   */
  const formatSize = (bytes) => {
    if (bytes === undefined || bytes === null) return "0 B";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  /**
   * Öğeyi silme işlemini yönetir.
   * @param {MouseEvent} e - Olay nesnesi.
   * @param {object} item - Silinecek öğe nesnesi.
   */
  const handleDelete = (e, item) => {
    // Olayın, üst bileşendeki onClick olayına yayılmasını engeller
    e.stopPropagation();
    e.preventDefault();

    // Basit bir onay mekanizması. Gelişmiş uygulamalar için modal önerilir.
    if (window.confirm("Bu öğeyi silmek istediğinizden emin misiniz?")) {
      console.log(`Öğe siliniyor: ${item.id} - Tipi: ${item.type}`);
      deleteItem(item);
    }
  };

  // Debug: Aynı ID'li item'ları kontrol et
  const duplicateIds = items.filter((item, index) =>
    items.findIndex(it => it.id === item.id && it.type === item.type) !== index
  );

  if (duplicateIds.length > 0) {
    console.warn("Aynı ID ve türe sahip item'lar bulundu:", duplicateIds);
  }

  return (
    <div className="grid">
      {items.map(it => (
        <div
          key={`${it.type}-${it.id}`} // En doğru ve güvenli key yöntemi budur
          className="card"
          onClick={() => openItem(it)} // 📌 DÜZELTME: Sadece id yerine tüm item objesini gönder
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
            onClick={(e) => handleDelete(e, it)} // 📌 DÜZELTME: Tüm item objesini gönder
            title="Sil"
          >
            <FiTrash2 />
          </button>
        </div>
      ))}
    </div>
  );
}