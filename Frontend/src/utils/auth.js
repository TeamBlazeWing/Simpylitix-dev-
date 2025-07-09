const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000;
    return Date.now() < expiry;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

const clearAuthData = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('loggedInUser');
};

export { isTokenValid, clearAuthData };