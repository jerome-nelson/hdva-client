// TODO: In global library - UserWithToken;
export interface User {
  createdOn: Date;
  email: string;
  group: number;
  modifiedOn: Date;
  name: string;
  password: string;
  role: number;
  token: string;
  userId: string;
  _id: string;
}

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

export { logout, setUser, getCurrentUser, };

