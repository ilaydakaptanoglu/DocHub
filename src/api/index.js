const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Token eklenmiş ve kimlik doğrulaması yapılmış HTTP istekleri için yardımcı fonksiyon
 * @param {string} url - İsteğin gönderileceği URL
 * @param {object} [options={}] - fetch API seçenekleri
 * @returns {Promise<Response>}
 */
export function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(`${BASE_URL}${url}`, { ...options, headers });
}

// Örnek: dosya yükleme
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await authFetch("/api/files/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Dosya yüklenirken hata oluştu: ${errorText}`);
  }

  return res.json();
}
