import { authFetch } from "./index.js";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const deleteFolder = async (folderId) => {
  const res = await authFetch(`${BASE_URL}/folders/${folderId}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Klasör silinemedi: ${await res.text()}`);
};