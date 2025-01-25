/* eslint-disable @typescript-eslint/no-explicit-any */

import { Routing } from "../../shared/constants/routing";
import { connectedRouterRedirect } from "redux-auth-wrapper/history4/redirect";

/**
 * General state
 */

/**
 * General action
 */
export interface IAction<T = unknown> {
  type: string | number;
  payload?: T;
}

// export const isUserAuthenticated = connectedRouterRedirect({
//   redirectPath: (state: IApplicationState) => {
//     if (
//       state.HRAUserData != null &&
//       state.HRAUserData.forceRedirection != null
//     ) {
//       return state.HRAUserData.forceRedirection;
//     }
//     return Routing.Login;
//   },
//   allowRedirectBack: false,
//   authenticatedSelector: (state: IApplicationState) => {
//     if (
//       state?.HRAUserData &&
//       state?.HRAUserData?.authConfigs &&
//       state?.HRAUserData?.authConfigs?.accessToken
//     ) {
//       return true;
//     }
//     return false;
//   },
//   wrapperDisplayName: "Authenticated",
// }) as any;

export const isNotAuthenticated = connectedRouterRedirect({
  redirectPath: Routing.Login,
  allowRedirectBack: false,
  authenticatedSelector: () => {
    return true;
  },
  wrapperDisplayName: "IsNotAuthenticated",
}) as any;
