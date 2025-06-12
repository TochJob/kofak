const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL_LIST = {
  apiLogin: `${API_URL}/auth/login/`,
  apiRegister: `${API_URL}/register`,

  apiGetProcessos: `${API_URL}/processes/`,
};

export default API_URL_LIST;
