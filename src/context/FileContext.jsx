import { createContext, useContext, useState, useEffect } from "react";
import * as api from "../api/files.js";
import * as folderApi from "../api/folders.js";
import { useAuth } from "./AuthContext.jsx"; // AuthContext import

const FileContext = createContext();

export function FileProvider({ children }) {
  const { user } = useAuth(); // user değişimini takip et

  const [state, setState] = useState({
    currentFolderId: "root",
    viewMode: "grid",
    selectedId: null,
  });

  const [filesCache, setFilesCache] = useState({});
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: "root", name: "Kök" }]);

  // 🔹 user değiştiğinde cache’i temizle
  useEffect(() => {
    setFilesCache({});
  }, [user]);

  // 🔹 Boyut formatlama helper
  function formatSize(size) {
    if (!size) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    let i = 0;
    let num = size;
    while (num >= 1024 && i < units.length - 1) {
      num /= 1024;
      i++;
    }
    return `${num.toFixed(1)} ${units[i]}`;
  }

  // Belirli bir klasörün içeriğini al (dosyalar + klasörler)
  const listChildren = async (folderId) => {
    if (filesCache[folderId]) return filesCache[folderId];

    try {
      const [files, folders] = await Promise.all([
        api.getFolderChildren(folderId),
        api.getFolders(folderId === "root" ? null : folderId)
      ]);

      const formattedFolders = folders.map(folder => ({
        id: folder.id,
        name: folder.folderName,
        type: "folder",
        parentId: folder.parentId,
        createdAt: folder.createdAt
      }));

      const formattedFiles = files.map(file => ({
        id: file.id,
        name: file.fileName,
        type: "file",
        contentType: file.contentType,
        size: file.size,
        folderId: file.folderId,
        uploadedAt: file.uploadedAt,
        lastOpenedAt: file.lastOpenedAt,
        url: file.url,
        downloadUrl: file.downloadUrl,
        userId: file.userId // backend’den userId gelmeli
      }));

      const combinedChildren = [...formattedFolders, ...formattedFiles];

      setFilesCache(prev => ({ ...prev, [folderId]: combinedChildren }));
      return combinedChildren;
    } catch (err) {
      console.error("Klasör içerikleri alınamadı:", err);
      return [];
    }
  };

  // Dosya ekleme
  const addFiles = async (files) => {
    try {
      const uploaded = await api.uploadFiles(state.currentFolderId, files);

      const formattedUploads = uploaded.map(file => ({
        id: file.id,
        name: file.fileName,
        type: "file",
        contentType: file.contentType,
        size: file.size,
        folderId: file.folderId,
        uploadedAt: file.uploadedAt,
        lastOpenedAt: file.lastOpenedAt,
        url: file.url,
        downloadUrl: file.downloadUrl,
        userId: file.userId
      }));

      setFilesCache(prev => ({
        ...prev,
        [state.currentFolderId]: [
          ...(prev[state.currentFolderId] || []),
          ...formattedUploads
        ],
      }));
    } catch (err) {
      console.error("Dosya yüklenemedi:", err);
      alert("Dosya yüklenirken hata oluştu: " + err.message);
    }
  };

  // Dosya veya klasörü açma
  const openItem = async (item) => {
    try {
      if (item.type === "folder") {
        goTo(item.id, item.name);
      } else if (item.type === "file") {
        window.open(item.downloadUrl, "_blank");
        try { await api.markOpened(item.id); } catch {}
        setFilesCache(prev => {
          const updated = (prev[state.currentFolderId] || []).map(f =>
            f.id === item.id && f.type === "file" ? { ...f, lastOpenedAt: new Date().toISOString() } : f
          );
          return { ...prev, [state.currentFolderId]: updated };
        });
      }
    } catch (err) {
      console.error("Öğe açılamadı:", err);
      alert("Öğe açılamadı: " + err.message);
    }
  };

  // Klasör oluşturma
  const createFolder = async (name) => {
    try {
      const folder = await api.createFolder(state.currentFolderId, name);
      const newFolder = { id: folder.id, name: folder.folderName, type: "folder", parentId: folder.parentId, createdAt: folder.createdAt };
      setFilesCache(prev => ({
        ...prev,
        [state.currentFolderId]: [...(prev[state.currentFolderId] || []), newFolder],
      }));
      return newFolder;
    } catch (err) {
      console.error("Klasör oluşturulamadı:", err);
      alert("Klasör oluşturulamadı: " + err.message);
      throw err;
    }
  };

  // Silme işlemi
  const deleteItem = async (item) => {
    try {
      if (item.type === "folder") await folderApi.deleteFolder(item.id);
      else await api.deleteItem(item.id);

      setFilesCache(prev => ({
        ...prev,
        [state.currentFolderId]: (prev[state.currentFolderId] || []).filter(i => i.id !== item.id),
      }));
    } catch (err) {
      console.error("Silme işlemi başarısız:", err);
      alert("Silme işlemi başarısız: " + err.message);
    }
  };

  const selected = () => (filesCache[state.currentFolderId] || []).find(i => i.id === state.selectedId);
  const setView = (mode) => setState(prev => ({ ...prev, viewMode: mode }));

  const goTo = (folderId, folderName) => {
    if (!folderId || folderId === "root") {
      setState(prev => ({ ...prev, currentFolderId: "root" }));
      setBreadcrumbs([{ id: "root", name: "Kök" }]);
    } else {
      setState(prev => ({ ...prev, currentFolderId: folderId }));
      setBreadcrumbs(prev => {
        const exists = prev.find(b => b.id === folderId);
        if (exists) return prev.slice(0, prev.indexOf(exists) + 1);
        return [...prev, { id: folderId, name: folderName }];
      });
    }
  };

  const getRecents = async (limit = 8) => {
    try {
      const recents = await api.getRecents(limit);
      return recents.map(file => ({
        id: file.id,
        name: file.fileName,
        type: "file",
        contentType: file.contentType,
        size: file.size,
        folderId: file.folderId,
        uploadedAt: file.uploadedAt,
        lastOpenedAt: file.lastOpenedAt,
        url: file.url,
        downloadUrl: file.downloadUrl,
        userId: file.userId
      }));
    } catch (err) {
      console.error("Son açılan dosyalar alınamadı:", err);
      return [];
    }
  };

  return (
    <FileContext.Provider value={{
      state,
      setView,
      listChildren,
      addFiles,
      createFolder,
      deleteItem,
      openItem,
      selected,
      breadcrumbs,
      goTo,
      getRecents,
      formatSize,
    }}>
      {children}
    </FileContext.Provider>
  );
}

export const useFiles = () => useContext(FileContext);
