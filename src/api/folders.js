import { authFetch } from "./index.js";

// 📂 Klasör silme
export const deleteFolder = async (folderId) => {
  const res = await authFetch(`/api/folders/${folderId}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Klasör silinemedi: ${await res.text()}`);
};
