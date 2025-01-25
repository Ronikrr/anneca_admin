import React from "react";
import { Link } from "react-router-dom";

const SettingTab = () => {
  return (
    <>
      <div className="col-span-2">
        <div className="setting-page-menu">
          <div className="card shadow">
            <div className="card-section border-b box-border">
              <div className="flex justify-between card-section-header mb-1">
                <h3 className="card-session-title">
                  <Link to={"/setting/store"}>Store Setting</Link>
                </h3>
              </div>
              <div className="card-session-content pt-lg">
                <div>Configure your store information</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingTab;
