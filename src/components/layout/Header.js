import React, { useState } from "react";
import { Main_logo } from "../../assets/icon";
import { connect, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOutSuccess } from "../Reducer/authSlice";
import Storage from "../utils/HandelLocalStorage";
import mainlogo from "../../assets/logo.png"

const Header = (props) => {

  let navigate = useNavigate();
  const dispatch = useDispatch();

  const { authUserDetails } = props;
  const [show, setshow] = useState(false)

  const logOut = () => {
    dispatch(logOutSuccess(null))
    Storage.clearItem("userDetails");
    navigate("/login", { replace: true });
  };

  return (
    <div className="header">
      <div className="logo">
        <a href="/admin" className="flex items-end"> 
          <img src={mainlogo} width={"120px"} height={"200px"} />
        </a>
      </div>
      <div className="search-box">
        <div className="form-field-container null">
          <div className="field-wrapper flex flex-grow">
            <div className="field-prefix align-middle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: "1.8rem", height: "1.8rem" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input type="text" placeholder="Search" defaultValue="" />
            <div className="field-border" />
          </div>
        </div>
      </div>
      <div className="admin-user flex flex-grow justify-end items-center">
        <div className="flex justify-items-start gap-1 justify-center">
          <div className="relative">
            <button className="first-letter" onClick={() => setshow(!show)}>
              {authUserDetails?.name?.charAt(0)?.toUpperCase()}
            </button>
            {show === true && (
              <div
                className={`logout bg-background shadow p-2 ${show === true ? "block" : "hide"
                  }`}
              >
                <div>
                  <div>
                    Hello <span className="text-primary">{authUserDetails?.full_name}</span>
                  </div>
                  <div className="mt-1" >
                    <a className="text-critical cursor-pointer" onClick={logOut}>
                      Logout
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    authUserDetails: state.auth.userInfo,
  };
};
export default connect(mapStateToProps)(Header);
