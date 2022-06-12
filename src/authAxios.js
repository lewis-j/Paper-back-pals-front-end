import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = axios.create({
  baseURL: process.env.REACT_APP_NEST_URI,
  withCredentials: true,
});

export const getClient = () => {
  return API;
};

const setcsrfToken = (_token) => {
  console.log("setting token", _token);
  API.defaults.headers["XSRF-TOKEN"] = _token ? `${_token}` : "";
};

const handleAxiosError = (error) => {
  if (error.response)
    return `Error in response: status:${error.response.status} headers: ${error.response.headers} data:${error.response.data}`;
  if (error.request) return `Error in request: ${error.request}`;

  return `Error ${error.message} ${error.config}`;
};

const AxiosInterceptor = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const resInterceptor = (response) => {
      return response;
    };

    const errInterceptor = (error) => {
      if (error.response.status === 401) {
        navigate("landing-page");
      }

      return Promise.reject(error);
    };

    const interceptor = API.interceptors.response.use(
      resInterceptor,
      errInterceptor
    );

    return () => API.interceptors.response.eject(interceptor);
  }, [navigate]);

  return children;
};

export default API;

export { setcsrfToken, handleAxiosError, AxiosInterceptor };