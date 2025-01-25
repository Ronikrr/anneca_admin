import React, { useState } from "react";
import SettingTab from "../SettingTab";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { ApiEndPoints } from "../../../apis/ApiEndPoints";
import {
  updatePassword,
} from "../../../apis/services/CommonApiService";
import Spinner from "../../../layout/spinner/spinner";

const Store_setting = () => {

  const [loading, setLoading] = useState(false);
  const [storDetail, setStorDetail] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleStoreInfo = (e) => {
    setStorDetail({ ...storDetail, [e.target.name]: e.target.value });
  };

  const handleupdateStoreInfo = async () => {
    setLoading(true);
    let data = {
      oldPassword: storDetail.current_password,
      newPassword: storDetail.new_password,
      confirmPassword: storDetail.confirm_password
    };
    const result = await updatePassword(data, ApiEndPoints.UPDATE_PASSWORD);
    if (result?.status === 200) {
      setLoading(false);
      setStorDetail({
        current_password: "",
        new_password: "",
        confirm_password: "",
      })
      toast.success(result.message);
    } else {
      setLoading(false);
      toast.error(result.message);
    }
  };

  return (
    <>
      {loading && <Spinner />}
      <div className="main-content-inner">
        <div className="grid grid-cols-6 gap-x-2 grid-flow-row ">
          <SettingTab />
          <div className="col-span-4">
            <div>
              <div className="card shadow">
                <div className="card-section border-b box-border">
                  <div className="flex justify-between card-section-header mb-1">
                    <h3 className="card-session-title">Store Information</h3>
                  </div>
                  <div className="card-session-content pt-lg">
                    <div className="form-field-container null">
                      <label htmlFor="storeName">Current password</label>
                      <div className="field-wrapper flex flex-grow">
                        <input
                          type="password"
                          name="current_password"
                          placeholder="Current password"
                          onChange={handleStoreInfo}
                          value={storDetail.current_password}
                        />
                        <div className="field-border" />
                      </div>
                    </div>
                    <div className="form-field-container null">
                      <label htmlFor="storeName">New password</label>
                      <div className="field-wrapper flex flex-grow">
                        <input
                          type="password"
                          name="new_password"
                          placeholder="New password"
                          onChange={handleStoreInfo}
                          value={storDetail.new_password}
                        />
                        <div className="field-border" />
                      </div>
                    </div>
                    <div className="form-field-container null">
                      <label htmlFor="storeName">Confirm new password</label>
                      <div className="field-wrapper flex flex-grow">
                        <input
                          type="password"
                          name="confirm_password"
                          placeholder="Confirm new password"
                          onChange={handleStoreInfo}
                          value={storDetail.confirm_password}
                        />
                        <div className="field-border" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-submit-button flex border-t border-divider mt-1 pt-1">
                <button
                  type="button"
                  onClick={handleupdateStoreInfo}
                  className="button primary"
                >
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    authUserDetails: state.auth.userInfo,
  };
};
export default connect(mapStateToProps)(Store_setting);
