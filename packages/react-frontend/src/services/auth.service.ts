const logout = () => {
  localStorage.removeItem("user");
};

const setUser = (data: any) => {
  if (!data || !data.user || !data.token) {
    return;
  }

  localStorage.setItem("user", JSON.stringify(data.user));
  localStorage.setItem("token", JSON.stringify(data.token));
}

const getCurrentUser = () => {
  const item = localStorage.getItem("user");
  
  if (!item) {
    return undefined;
  }
  
  return JSON.parse(item);
};

export {
  logout,
  setUser,
  getCurrentUser,
};