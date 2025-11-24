export const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  return token ? true : false;
};

export const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    console.log(e);
    
    return true;
  }
};
