import { createContext, useContext, useState } from "react";
import * as api from "../api/files.js";
import * as folderApi from "../api/folders.js";

const FileContext = createContext();

export function FileProvider({ children }) {
  const [state, setState] = useState({
    currentFolderId: "root",
    viewMode: "grid",
    selectedId: null,
  });

  const [filesCache, setFilesCache] = useState({}); // folderId -> items
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: "root", name: "Kök" }]);

  // Belirli bir klasörün içeriğini al (dosyalar + klasörler)
  const listChildren = async (folderId) => {
    const id = folderId || "root";
    if (filesCache[id]) return filesCache[id];

    try {
      const [files, folders] = await Promise.all([
        api.getFolderChildren(id),
        api.getFolders(id === "root" ? null : id)
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
        url: file.url
      }));

      const combined = [...formattedFolders, ...formattedFiles];
      setFilesCache(prev => ({ ...prev, [id]: combined }));
      return combined;
    } catch (err) {
      console.error("Klasör içerikleri alınamadı:", err);
      return [];
    }
  };

  const getRecents = async (limit = 8) => {
    try {
      const recents = await api.getRecents(limit);
      return recents;
    } catch (err) {
      console.error("Son açılan dosyalar alınamadı:", err);
      return [];
    }
  };

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
        url: file.url
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

  const createFolder = async (name) => {
    try {
      const folder = await api.createFolder(state.currentFolderId, name);
      const newFolder = {
        id: folder.id,
        name: folder.folderName,
        type: "folder",
        parentId: folder.parentId,
        createdAt: folder.createdAt
      };

      setFilesCache(prev => ({
        ...prev,
        [state.currentFolderId]: [
          ...(prev[state.currentFolderId] || []),
          newFolder
        ],
      }));

      return newFolder;
    } catch (err) {
      console.error("Klasör oluşturulamadı:", err);
      alert("Klasör oluşturulamadı: " + err.message);
      throw err;
    }
  };

  const deleteItem = async (item) => {
    try {
      if (item.type === "folder") {
        await folderApi.deleteFolder(item.id);
        alert("Klasör ve içeriği başarıyla silindi!");
      } else {
        await api.deleteItem(item.id);
        alert("Dosya başarıyla silindi!");
      }

      setFilesCache(prev => ({
        ...prev,
        [state.currentFolderId]: (prev[state.currentFolderId] || []).filter(i => i.id !== item.id)
      }));
    } catch (err) {
      console.error("Silme işlemi başarısız:", err);
      alert("Silme işlemi başarısız: " + err.message);
    }
  };

  const openItem = async (item) => {
    try {
      if (item.type === "folder") {
        goTo(item.id, item.name);
      } else if (item.type === "file") {
        window.open(item.url, "_blank");
      }
    } catch (err) {
      console.error("Öğe açılamadı:", err);
      alert("Öğe açılamadı: " + err.message);
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

  return (
    <FileContext.Provider
      value={{
        state,
        setView,
        listChildren,
        getRecents,
        addFiles,
        createFolder,
        deleteItem,
        openItem,
        selected,
        breadcrumbs,
        goTo
      }}
    >
      {children}
    </FileContext.Provider>
  );
}

export const useFiles = () => useContext(FileContext);
