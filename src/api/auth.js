const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Login fonksiyonu
export const login = async (username, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Username: username, Password: password }) // DTO ile uyumlu
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Login failed");
  }

  return await res.json(); // { token, user }
};

// Register fonksiyonu
export const register = async (data) => {
  // data = { Username, Email, Password, ConfirmPassword, FirstName?, LastName? }
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data) // DTO formatına uygun
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Registration failed");
  }

  return await res.json(); // { token, user }
};

// Opsiyonel: Me (current user) fonksiyonu
export const getMe = async (token) => {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    }
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to get user info");
  }

  return await res.json(); // user DTO
};
