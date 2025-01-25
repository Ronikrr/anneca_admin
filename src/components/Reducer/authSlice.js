import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo:  null,
  userToken: "",
};
const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.userInfo = action.payload.data;
      state.userToken = action.payload.token;
    },
    logOutSuccess: (state, action) => {
      state.userInfo = null;  
      state.userToken = "";
    },
  },
});

export const { loginSuccess, logOutSuccess } = authSlice.actions;
export default authSlice.reducer;
