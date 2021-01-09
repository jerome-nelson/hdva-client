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
