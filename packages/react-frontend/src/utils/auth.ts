export default function authHeader() {
  const item = localStorage.getItem('user');

  if (!item) {
    return {};
  }
  const user = JSON.parse(item);

  if (user && user.accessToken) {
    return { Authorization: 'Bearer ' + user.accessToken };
  } else {
    return {};
  }
}

export const getToken = () => {
  const user = localStorage.getItem("user");
  const item = user && JSON.parse(user);
  debugger;
  return item && item.token;
}