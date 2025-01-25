import React, { useState } from "react";
import { Main_logo } from "../../../assets/icon";
import { toast } from "react-toastify";
import "./Login.css";
import Storage from "../../utils/HandelLocalStorage";
import { Routing } from "../../shared/constants/routing";
import { useNavigate } from "react-router-dom";
import { login } from "../../apis/services/AuthApiService";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../Reducer/authSlice";
import Spinner from "../../layout/spinner/spinner";
import mainlogo from "../../../assets/logo.png"

const Login = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const handleUserdata = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    let data = {
      email: userData.email,
      password: userData.password,
    };
    const result = await login(data);
    if (result?.status === 200) {
      setLoading(false);
      Storage.storeItem("userDetails", JSON.stringify(result));
      Storage.storeItem("user_token", result.token);
      if (result.user.role === "admin") {
        dispatch(loginSuccess(result));
        toast.success(result?.message);
        navigate(Routing.Dashboard, { replace: true });
        window.location.reload();
      }
    } else {
      setLoading(false);
      toast.error(result?.message);
    }
  };

  return (
    <>
      {loading && <Spinner />}
      <div id="app" className="bg-background">
        <div className="wrapper">
          <div className="content-wrapper">
            <div className="main-content">
              <div className="main-content-inner">
                <div className="admin-login-form">
                  <div className="flex items-center justify-center mb-3">
                    {/* <Main_logo width={"60px"} height={"60px"} /> */}
                    <img src={mainlogo} width={"120px"} height={"200px"} />

                  </div>
                  <div>
                    <div className="form-field-container null">
                      <label htmlFor="email">Admin</label>
                      <div className="field-wrapper flex flex-grow">
                        <input
                          type="text"
                          placeholder="Admin"
                          name="email"
                          value={userData.email}
                          onChange={handleUserdata}
                        />
                        <div className="field-border" />
                      </div>
                    </div>
                    <div className="form-field-container null">
                      <label htmlFor="password">Password</label>
                      <div className="field-wrapper flex flex-grow">
                        <input
                          type="password"
                          placeholder="Password"
                          value={userData.password}
                          name="password"
                          onChange={handleUserdata}
                        />
                        <div className="field-border" />
                      </div>
                    </div>
                    <div className="form-submit-button flex border-t border-divider mt-1 pt-1">
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        className="button primary"
                      >
                        <span>Login</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="Toastify" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
