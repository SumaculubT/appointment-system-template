import { createContext, useContext, useState } from "react";

const StateContext = createContext({
  user: null,
  token: null,
  inquiries: [],
  products: [],
  services: [],
  fetchInquiries: () => {},
  fetchProducts: () => {},
  fetchServices: () => {},
  setUser: () => {},
  setToken: () => {},
  notification: null,
  setNotification: () => {},
});

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
  const [notification, _setNotification] = useState("");
  const [inquiries, setInquiries] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);

  const setToken = (token) => {
    _setToken(token);
    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };

  const setNotification = (message) => {
    _setNotification(message);
    setTimeout(() => _setNotification(""), 4000);
  };

  const fetchInquiries = (data) => {
    setInquiries(data);
  };

  const fetchProducts = (data) => {
    setProducts(data);
  };

  const fetchServices = (data) => {
    setServices(data);
  };

  return (
    <StateContext.Provider
      value={{
        user,
        token,
        setUser,
        setToken,
        notification,
        setNotification,
        inquiries,
        fetchInquiries,
        products,
        fetchProducts,
        services,
        fetchServices,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
