import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

const login = (username: string, password: string) => {
  const mockResponse = {
    accessToken: "1234556TEST",
  };
  localStorage.setItem("user", JSON.stringify(mockResponse));
  return mockResponse;

  // return axios
  //   .post(API_URL + "signin", {
  //     username,
  //     password,
  //   })
  //   .then((response) => {
  //     if (response.data.accessToken) {
  //       localStorage.setItem("user", JSON.stringify(response.data));
  //     }

  //     return response.data;
  //   });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  const item = localStorage.getItem("user");
  
  if (!item) {
    return undefined;
  }
  
  return JSON.parse(item);
};

export {
  login,
  logout,
  getCurrentUser,
};