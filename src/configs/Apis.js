import axios from "axios";
import cookie from "react-cookies";

const SERVER_CONTEXT = "/SpringFoodPlacesWeb";
const SERVER = "http://localhost:8080";

export const endpoints = {
    "foodItems": `${SERVER_CONTEXT}/api/foodItems/`,
    "categories": `${SERVER_CONTEXT}/api/categories/`,
    "register": `${SERVER_CONTEXT}/api/register/`,
    "update-user": `${SERVER_CONTEXT}/api/update-user/`,
    "login": `${SERVER_CONTEXT}/api/login/`,
    "current-user": `${SERVER_CONTEXT}/api/current-user/`,
    "pay": `${SERVER_CONTEXT}/api/pay/`,
    "detail": (foodId) => `${SERVER_CONTEXT}/api/foodItems/${foodId}/`,
    "comments": (foodId) => `${SERVER_CONTEXT}/api/foodItems/${foodId}/comments/`,
    "add-comment": `${SERVER_CONTEXT}/api/add-comment/`,
    "restaurant": `${SERVER_CONTEXT}/api/restaurants/`,
    "restaurant-detail": (restaurantId) => `${SERVER_CONTEXT}/api/restaurants/${restaurantId}/`,
    "register-restaurant": `${SERVER_CONTEXT}/api/register-restaurant/`,
    "receipt": `${SERVER_CONTEXT}/api/receipts/`,
    "receipt-details": (receiptId) => `${SERVER_CONTEXT}/api/receipt/${receiptId}/receiptDetails/`,
    "change-password": `${SERVER_CONTEXT}/api/change-password/`
}

export const authApi = () => {
    return axios.create({
        baseURL: SERVER,
        headers: {
            "Authorization": cookie.load("token")
        }
    })
}

export default axios.create({
    baseURL: SERVER
})