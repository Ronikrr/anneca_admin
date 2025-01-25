import axios from "axios";
import { BASE_URL } from "../../config/Urls";

export const createNewProduct = async (data) => {
   
    try {
        let response = await axios({
            method: "POST",
            url: `${BASE_URL}product/new`,
            headers: {
                Authorization: `${localStorage.getItem("user_token")}`,
                "Content-Type": "multipart/form-data",
            },
            data: data,
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return error?.response?.data;
    }
};

export const deleteProducts = async (productIds) => {
    try {
        let response = await axios({
            method: "DELETE",
            url: `${BASE_URL}product/bulk-delete`,
            headers: {
                Authorization: `${localStorage.getItem("user_token")}`,
                "Content-Type": "application/json",
            },
            data: { productIds },
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return error?.response?.data;
    }
};

export const enableProducts = async (productIds) => {
    try {
        let response = await axios({
            method: "PATCH",
            url: `${BASE_URL}product/bulk-enable`,
            headers: {
                Authorization: `${localStorage.getItem("user_token")}`,
                "Content-Type": "application/json",
            },
            data: { productIds },
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return error?.response?.data;
    }
};

export const disableProducts = async (productIds) => {
    try {
        let response = await axios({
            method: "PATCH",
            url: `${BASE_URL}product/bulk-disable`,
            headers: {
                Authorization: `${localStorage.getItem("user_token")}`,
                "Content-Type": "application/json",
            },
            data: { productIds },
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return error?.response?.data;
    }
};

export const createNewMeasurement = async (data) => {
    try {
        let response = await axios({
            method: "POST",
            url: `${BASE_URL}measurements/add`,
            headers: {
                Authorization: `${localStorage.getItem("user_token")}`,
            },
            data: data,
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return error?.response?.data;
    }
};
export const fetchProductById = async (productId) => {
    try {
        let response = await axios({
            method: "GET",
            url: `${BASE_URL}product/${productId}`,
            headers: {
                Authorization: `${localStorage.getItem("user_token")}`,
            },
            
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return error?.response?.data;
    }
};

export const updateProductById = async (productId, updatedData) => {
   
    try {
        let response = await axios({
            method: "PUT",
            url: `${BASE_URL}product/${productId}`,
            headers: {
               
                Authorization: `${localStorage.getItem("user_token")}`,
            },
            data: updatedData,
        });
       
        return response.data;
    } catch (error) {
        console.log(error);
        return error?.response?.data;
    }
};

export const deleteProductImage = async (productId, imageIndex) => {
  console.log(productId, imageIndex); // Debugging log
  try {
    const params = new URLSearchParams();
    params.append("imageIndex", imageIndex);

    const response = await fetch(`${BASE_URL}product/productImage/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // Change to URL-encoded
        Authorization: `${localStorage.getItem("user_token")}`,
      },
      body: params.toString(), // Send as URL-encoded string
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting product image:', error);
    throw error;
  }
};