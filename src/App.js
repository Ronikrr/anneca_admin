import React, { Suspense, useEffect } from "react";
import "./App.css";
import AppRouting from "./components/shared/AppRouting";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "./components/layout/spinner/spinner";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./components/Reducer/authSlice";
import instance from "./components/apis/ApiConfig";

function App() {
  const dispath = useDispatch();

  useEffect(() => {
    async function setUserState(params) {
      instance.defaults.headers.common["Authorization"] = params?.Token;
      await dispath(loginSuccess(params));
    }
    const data = localStorage.getItem("userDetails");
    const token = localStorage.getItem("user_token");
    if (data) {
      const userDetails = { data: JSON.parse(data)?.user, token: token }
      setUserState(userDetails);
    }
  }, []);

  return (
    <>
      <Suspense fallback={<Spinner />}>
        <AppRouting />
      </Suspense>
    </>
  );
}

export default App;
