const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL_LIST = {
  apiLogin: `${API_URL}/auth/login/`,
  register: `${API_URL}/register`,
  profile: `${API_URL}/profile`,
  logout: `${API_URL}/logout`,
};

export default API_URL_LIST;
