export const generateJWT = (email: string): string => {
  const tokenPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiry
  };
  return btoa(JSON.stringify(tokenPayload)); // Fake token (in real-world use `jsonwebtoken`)
};

export function isAuthenticated(): boolean {
  const token = localStorage.getItem("token");
  return !!token;
}
