const KEY = "lumora_token";

export const saveToken = (token) => localStorage.setItem(KEY, token);
export const getToken = () => localStorage.getItem(KEY);
export const removeToken = () => localStorage.removeItem(KEY);
