import React from 'react'
import "./404page.css";
import { useNavigate } from 'react-router-dom';

function NoteExit404() {
  const navigate = useNavigate();
  const pathName = window.location.pathname

  return (
    <>
      {
        pathName === "/" || pathName === "/login" ? "" :
          <div className="login-wrapper">
                <div className="main-content">
                  <div style={{
                    margin: "0",
                    padding: "0",
                    textAlign: "center"
                  }}>
                    <div className="section">
                      <h1 className="error">404</h1>
                      <div className="page">Ooops!!! The page you are looking for is not found</div>
                      <button onClick={() => navigate(-1)} className="back-home">Back</button>
                    </div>
                  </div>
                </div>
          </div>
      }
    </>
  )
}

export default NoteExit404