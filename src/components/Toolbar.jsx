import { useRef } from "react";
import { useFiles } from "../context/FileContext.jsx";
import { FiFolderPlus, FiUpload, FiGrid, FiList, FiTrash2 } from "react-icons/fi";

export default function Toolbar() {
  const { setView, state, createFolder, addFiles, selected, openItem, deleteItem } = useFiles();
  const fileInputRef = useRef();

  const onCreateFolder = async () => {
    const name = prompt("Klasör adı:");
    if (name && name.trim()) {
      try {
        await createFolder(name.trim());
      } catch (err) {
        console.error("Klasör oluşturulurken hata oluştu:", err);
        alert("Klasör oluşturulamadı.");
      }
    }
  };

  const onPickFiles = () => fileInputRef.current?.click();

  const onFilesChosen = async (e) => {
    const files = e.target.files;
    if (files?.length) {
      try {
        await addFiles(files);
      } catch (err) {
        console.error("Dosya yüklenirken hata oluştu:", err);
        alert("Dosya yüklenirken bir hata oluştu.");
      }
    }
    e.target.value = "";
  };

  const onOpenSelected = async () => {
    const item = selected();
    if (item) {
      try {
        await openItem(item.id);
      } catch (err) {
        console.error("Dosya açılırken hata oluştu:", err);
        alert("Dosya açılamadı.");
      }
    }
  };

  const onDeleteSelected = async () => {
    const item = selected();
    if (!item) return alert("Önce bir dosya veya klasör seçin.");
    if (confirm(`${item.name} silinsin mi?`)) {
      try {
        await deleteItem(item.id);
      } catch (err) {
        console.error("Dosya/klasör silinirken hata oluştu:", err);
        alert("Silme işlemi başarısız.");
      }
    }
  };

  return (
    <div className="toolbar">
      <button className="btn" onClick={onCreateFolder}>
        <FiFolderPlus /> Klasör Oluştur
      </button>

      <button className="btn" onClick={onPickFiles}>
        <FiUpload /> Dosya Yükle
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,video/*"
        multiple
        style={{ display: "none" }}
        onChange={onFilesChosen}
      />

      <div style={{ flex: 1 }} />

      <button
        className="btn secondary"
        title="Grid"
        onClick={() => setView("grid")}
        aria-pressed={state.viewMode === "grid"}
      >
        <FiGrid /> Grid
      </button>

      <button
        className="btn secondary"
        title="Liste"
        onClick={() => setView("list")}
        aria-pressed={state.viewMode === "list"}
      >
        <FiList /> Liste
      </button>

      <button className="btn danger" onClick={onDeleteSelected}>
        <FiTrash2 /> Sil
      </button>

      <button className="btn" onClick={onOpenSelected}>
        Aç
      </button>
    </div>
  );
}