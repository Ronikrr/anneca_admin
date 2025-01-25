import instance from "../ApiConfig";
import { ApiEndPoints } from "../ApiEndPoints";

export const login = async (data) => {
  try {
    const result = await instance({
      url: ApiEndPoints.LOGIN_API_CALL,
      method: "POST",
      data,
    });
    return result?.data;
  } catch (error) {
    throw error;
  }
};
