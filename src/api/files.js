const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getFolderChildren = async (folderId) => {
  // "root" ve "null" string'lerini null integer'a çevir
  let parsedFolderId = folderId;
  if (folderId === "root" || folderId === "null") {
    parsedFolderId = null;
  }

  const res = await fetch(`${BASE_URL}/files?folderId=${parsedFolderId}`);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Klasör içerikleri alınamadı: ${errorText}`);
  }
  return res.json();
};

export const getRecents = async (limit = 8) => {
  const res = await fetch(`${BASE_URL}/files/recent?limit=${limit}`);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Son açılan dosyalar alınamadı: ${errorText}`);
  }
  return res.json();
};

export const uploadFiles = async (folderId, files) => {
  const formData = new FormData();
  
  // Tüm dosyaları ekle (forEach yerine for loop)
  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }
  
  // "root" string'ini null'a çevir
  if (folderId && folderId !== "root" && folderId !== "null") {
    formData.append("folderId", folderId);
  }

  const res = await fetch(`${BASE_URL}/files/upload`, {
    method: "POST",
    body: formData,
    // NOT: FormData ile Content-Type header'ı EKLEMEYİN, browser otomatik ayarlar
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Dosya yüklenemedi: ${errorText}`);
  }
  return res.json();
};

export const deleteItem = async (id) => {
  const res = await fetch(`${BASE_URL}/files/${id}`, { 
    method: "DELETE" 
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Silme işlemi başarısız: ${errorText}`);
  }
};

export const getItem = async (id) => {
  const res = await fetch(`${BASE_URL}/files/${id}`);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Dosya açılamadı: ${errorText}`);
  }
  return res.json();
};

export const createFolder = async (parentId, name) => {
  // "root" string'ini null integer'a çevir
  const parsedParentId = parentId === "root" ? null : parentId;

  const res = await fetch(`${BASE_URL}/folders`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify({
      folderName: name,
      parentId: parsedParentId
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Klasör oluşturulamadı: ${errorText}`);
  }

  return res.json();
};

// 📌 YENİ EKLENEN FONKSİYONLAR:

export const getFolders = async (parentId = null) => {
  const params = new URLSearchParams();
  if (parentId !== null && parentId !== undefined) {
    params.append('parentId', parentId);
  }

  const res = await fetch(`${BASE_URL}/folders?${params}`);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Klasörler alınamadı: ${errorText}`);
  }
  return res.json();
};

export const markAsOpened = async (id) => {
  const res = await fetch(`${BASE_URL}/files/open/${id}`, {
    method: "PATCH"
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Dosya açılma durumu güncellenemedi: ${errorText}`);
  }
};