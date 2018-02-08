export const saveAuthentication = authentication => {
  // Set the time that the access token will expire at
  const expiresAt = JSON.stringify(
    (authentication.expires_in * 1000) + new Date().getTime()
  );
  localStorage.setItem('access_token', authentication.access_token);
  localStorage.setItem('expires_at', expiresAt);
};

export const clearAuthentication = () => {
  // Remove tokens and expiry time from localStorage
  localStorage.removeItem('access_token');
  localStorage.removeItem('expires_at');
};

export const isAuthenticated = () => {
  const accessToken = localStorage.getItem('access_token');
  const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
  return !!accessToken && (new Date().getTime() < expiresAt);
}

export const getAccessToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');
export const getBearerToken = () => {
  return 'Bearer ' + getAccessToken();
}