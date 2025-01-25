import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../config/Urls";
import Storage from "../utils/HandelLocalStorage";

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 180000,
  params: {},
});

let token = "";
const params = window.localStorage.getItem("user_token");
  if (params === null || params === undefined || params === "") {
  } else {
    token = params;
  }


instance.interceptors.request.use(
  function (config) {
    if (token) {
      config.headers.Authorization = token;
      // config.headers.Cookie = "token=" + token;

    }
    return config;
  },
  function (error) {
    console.log("error from interceptor request", error);
    return Promise.reject(error);

  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // console.log('++++++++++Response Config++++++++++', response);
    return response;
  },
  function (error) {

    return error.response;

  }
);

export default instance;
