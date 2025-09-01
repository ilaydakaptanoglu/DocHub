const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Token eklenmiş ve kimlik doğrulaması yapılmış HTTP istekleri için bir yardımcı fonksiyon.
 * @param {string} url - İsteğin gönderileceği URL.
 * @param {object} [options={}] - fetch API'sinin desteklediği seçenekler.
 * @returns {Promise<Response>} - fetch API'sinden dönen Promise.
 */
export function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  return fetch(`${BASE_URL}${url}`, { ...options, headers });
}

// Dosya yükleme gibi özel API istekleri için fonksiyonları buraya ekleyebilirsin.
// Bu fonksiyonlar, authFetch'i kullanarak istekleri daha okunaklı hale getirir.
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await authFetch("/api/files", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Dosya yüklenirken hata oluştu: ${errorText}`);
  }

  return res.json();
}