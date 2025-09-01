import { authFetch } from "./index.js";

// Klasörün altındaki dosya ve klasörleri getir
export const getFolderChildren = async (folderId) => {
  let parsedFolderId = folderId;
  if (folderId === "root" || folderId === "null") parsedFolderId = null;

  const res = await authFetch(`/api/files?folderId=${parsedFolderId}`);
  if (!res.ok) throw new Error(`Klasör içerikleri alınamadı: ${await res.text()}`);
  return res.json();
};

// Son açılan dosyalar
export const getRecents = async (limit = 8) => {
  const res = await authFetch(`/api/files/recent?limit=${limit}`);
  if (!res.ok) throw new Error(`Son açılan dosyalar alınamadı: ${await res.text()}`);
  return res.json();
};

// Dosya yükleme
export const uploadFiles = async (folderId, files) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) formData.append("files", files[i]);
  if (folderId && folderId !== "root" && folderId !== "null") {
    formData.append("folderId", folderId);
  }

  const res = await authFetch("/api/files/upload", { method: "POST", body: formData });
  if (!res.ok) throw new Error(`Dosya yüklenemedi: ${await res.text()}`);
  return res.json();
};

// Dosya veya klasör silme
export const deleteItem = async (id) => {
  const res = await authFetch(`/api/files/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Silme işlemi başarısız: ${await res.text()}`);
};

// Tek bir dosyayı getir
export const getItem = async (id) => {
  const res = await authFetch(`/api/files/${id}`);
  if (!res.ok) throw new Error(`Dosya açılamadı: ${await res.text()}`);
  return res.json();
};

// Yeni klasör oluştur
export const createFolder = async (parentId, name) => {
  const parsedParentId = parentId === "root" ? null : parentId;

  const res = await authFetch("/api/folders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folderName: name, parentId: parsedParentId }),
  });

  if (!res.ok) throw new Error(`Klasör oluşturulamadı: ${await res.text()}`);
  return res.json();
};

// Belirli klasördeki klasörleri getir
export const getFolders = async (parentId = null) => {
  const params = new URLSearchParams();
  if (parentId !== null && parentId !== undefined) params.append("parentId", parentId);

  const res = await authFetch(`/api/folders?${params.toString()}`);
  if (!res.ok) throw new Error(`Klasörler alınamadı: ${await res.text()}`);
  return res.json();
};

// Dosya açıldığında durum güncelle
export const markOpened = async (id) => {
  const res = await authFetch(`/api/files/open/${id}`, { method: "PATCH" });
  if (!res.ok) throw new Error(`Dosya açılma durumu güncellenemedi: ${await res.text()}`);
};
