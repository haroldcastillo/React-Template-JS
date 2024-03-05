import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, Outlet, Navigate } from 'react-router-dom';
import axios from './useAxios';

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  register: () => {},
  isAuth: () => false,
});

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const login = async (data) => {
    const { email, password } = data;
    try {
      const response = await axios.post(`/auth/login`, {
        email: email,
        password: password,
      });
      console.log(response.data);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      navigate('/profile');
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const register = async (data) => {
    const { name, first, middle, last, extension, sex, birthday, address, contact, about, email, password, role } = data;

    try {
      const response = await axios.post(`/auth/register`, {
        name: name,
        firstName: first,
        middleName: middle,
        lastName: last,
        extensionName: extension,
        sex: sex,
        birthday: birthday,
        address: address || ' ',
        contact: contact || ' ',
        about: about || ' ',
        email: email,
        password: password,
        role: role,
      });
      console.log(response);
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const logout = async () => {
    await axios.post(`/auth/logout`);
    localStorage.clear();
    navigate('/');
  };

  const isAuth = (id) => {
    if (!user) {
      return false;
    }
    return true;
  };

  useEffect(() => {}, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

const ProtectedRoute = ({ allowedRoles }) => {
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';
  const type = user.type;

  return user ? (
    allowedRoles ? (
      allowedRoles.includes(type) ? <Outlet /> : <Navigate to="/forbidden" />
    ) : (
      <Outlet />
    )
  ) : (
    <Navigate to="/login" />
  );
};

export { AuthProvider, useAuth, ProtectedRoute };
