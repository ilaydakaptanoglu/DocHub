import { useEffect, useState } from "react";
import Toolbar from "../components/Toolbar.jsx";
import UploadDropzone from "../components/UploadDropzone.jsx";
import FileGrid from "../components/FileGrid.jsx";
import FileList from "../components/FileList.jsx";
import PreviewPane from "../components/PreviewPane.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import { useFiles } from "../context/FileContext.jsx";

export default function Explorer() {
  const { state, listChildren, openItem } = useFiles();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const children = await listChildren(state.currentFolderId);
        setItems(children);
      } catch (err) {
        console.error("Klasör içeriği alınırken hata oluştu:", err);
      }
    };

    fetchItems();
  }, [listChildren, state.currentFolderId]);

  return (
    <div>
      <h1 className="page-title">Dosyalar</h1>
      <Breadcrumbs />
      <Toolbar />
      <div className="split">
        <div className="panel" style={{ minHeight: 300 }}>
          <UploadDropzone />
          <div style={{ height: 12 }} />
          {state.viewMode === "grid" ? (
            <FileGrid items={items} onOpen={openItem} />
          ) : (
            <FileList items={items} onOpen={openItem} />
          )}
        </div>
        <PreviewPane />
      </div>
    </div>
  );
}