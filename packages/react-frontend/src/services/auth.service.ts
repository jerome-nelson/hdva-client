const logout = () => {
  localStorage.removeItem("user");
};

const setUser = (data: any) => {
  if (!data || !data.token) {
    return;
  }

  localStorage.setItem("user", JSON.stringify(data));
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