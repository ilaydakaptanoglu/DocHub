import { useEffect, useState } from "react";
import { useFiles } from "../context/FileContext.jsx";
import FileGrid from "../components/FileGrid.jsx";

export default function Home() {
  const { getRecents, openItem } = useFiles();
  const [recents, setRecents] = useState([]);

  useEffect(() => {
    const fetchRecents = async () => {
      try {
        const recentFiles = await getRecents(8);
        setRecents(recentFiles);
      } catch (err) {
        console.error("Son açılan dosyalar alınırken hata oluştu:", err);
      }
    };

    fetchRecents();
  }, [getRecents]);

  return (
    <div>
      <h1 className="page-title">Home</h1>
      {recents.length === 0 ? (
        <div className="panel">
          Henüz "Son Açılanlar" yok. Dosyalar sayfasından bir dosya açtığında burada görünecek.
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 8, color: "#9ca3af" }}>Son Açılanlar</div>
          <div className="panel">
            <FileGrid items={recents} onOpen={openItem} />
          </div>
        </>
      )}
    </div>
  );
}