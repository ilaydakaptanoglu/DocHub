const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const login = async (username, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Login başarısız: ${errorText}`);
  }

  const data = await res.json();
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);
  return data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};

export const getToken = () => localStorage.getItem("token");
export const getRole = () => localStorage.getItem("role");
export const isAdmin = () => getRole() === "Admin";
