export const useAuth = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return { isAuthenticated: false, roleId: null };

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(base64));

    return {
      isAuthenticated: true,
      roleId: decoded.role_Id ? parseInt(decoded.role_Id, 10) : null,
      userId: decoded.id,
    };
  } catch (error) {
    return { isAuthenticated: false, roleId: null };
  }
};
