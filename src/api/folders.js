// folders.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Belirli bir klasör ID'sine sahip klasörü siler.
 * @param {number} folderId - Silinecek klasörün ID'si.
 */
export const deleteFolder = async (folderId) => {
    const res = await fetch(`${BASE_URL}/folders/${folderId}`, {
        method: "DELETE"
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Klasör silinemedi: ${errorText}`);
    }
};