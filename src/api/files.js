import { authFetch } from "./index.js";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getFolderChildren = async (folderId) => {
  const parsedFolderId = !folderId || folderId === "root" ? "" : folderId;
  const res = await authFetch(`${BASE_URL}/files?folderId=${parsedFolderId}`);
  if (!res.ok) throw new Error(`Klasör içerikleri alınamadı: ${await res.text()}`);
  return res.json();
};

export const getRecents = async (limit = 8) => {
  const res = await authFetch(`${BASE_URL}/files/recent?limit=${limit}`);
  if (!res.ok) throw new Error(`Son açılan dosyalar alınamadı: ${await res.text()}`);
  return res.json();
};

export const uploadFiles = async (folderId, files) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) formData.append("files", files[i]);
  if (folderId && folderId !== "root") formData.append("folderId", folderId);

  const res = await authFetch(`${BASE_URL}/files/upload`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) throw new Error(`Dosya yüklenemedi: ${await res.text()}`);
  return res.json();
};

export const deleteItem = async (id) => {
  const res = await authFetch(`${BASE_URL}/files/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Silme işlemi başarısız: ${await res.text()}`);
};

export const getItem = async (id) => {
  const res = await authFetch(`${BASE_URL}/files/${id}`);
  if (!res.ok) throw new Error(`Dosya açılamadı: ${await res.text()}`);
  return res.json();
};

export const createFolder = async (parentId, name) => {
  const parsedParentId = parentId === "root" ? null : parentId;
  const res = await authFetch(`${BASE_URL}/folders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folderName: name, parentId: parsedParentId })
  });
  if (!res.ok) throw new Error(`Klasör oluşturulamadı: ${await res.text()}`);
  return res.json();
};

export const getFolders = async (parentId = null) => {
  const params = new URLSearchParams();
  if (parentId && parentId !== "root") params.append("parentId", parentId);
  const query = params.toString() ? `?${params.toString()}` : "";
  const res = await authFetch(`${BASE_URL}/folders${query}`);
  if (!res.ok) throw new Error(`Klasörler alınamadı: ${await res.text()}`);
  return res.json();
};

export const markAsOpened = async (id) => {
  const res = await authFetch(`${BASE_URL}/files/open/${id}`, { method: "PATCH" });
  if (!res.ok) throw new Error(`Dosya açılma durumu güncellenemedi: ${await res.text()}`);
};
