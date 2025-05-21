import React, { createContext, useContext, useEffect, useState } from "react";
import { isTokenExpired } from "@/utils/auth";
import api from "@/api/api";
import { endpoints } from "@/constants/urls";

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

//create seperate components for auth context, auth provider and useAuth hook.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
});
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      const storedUser = localStorage.getItem("user");
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (storedUser && accessToken) {
        if (isTokenExpired(accessToken)) {
          if (refreshToken) {
            try {
              const response = await api.post(endpoints.refresh, { refreshToken });
              const { access_token, refresh_token, user } = response.data;

              localStorage.setItem("accessToken", access_token);
              localStorage.setItem("refreshToken", refresh_token);
              localStorage.setItem("user", JSON.stringify(user));
              setUser(user);
            } catch (err) {
              console.error("Token refresh failed", err);
              logout();
            }
          } else {
            logout();
          }
        } else {
          setUser(JSON.parse(storedUser));
        }
      }

      setLoading(false);
    };

    loadUser();
  }, []);

 const login = async () => {
  const email = "john@mail.com";
  const password = "changeme";

  try {
    const response = await api.post(endpoints.login, { email, password });

    const { access_token, refresh_token } = response.data;

    const profile = await api.get(endpoints.profile, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const user = profile.data;

    localStorage.setItem("accessToken", access_token);
    localStorage.setItem("refreshToken", refresh_token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  } catch (error) {
    console.error("Login failed", error);
    throw new Error("Invalid credentials");
  }
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};