import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Home from "./components/Home";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from "react-bootstrap";
import Login from "./components/Login";
import { createContext, useReducer } from "react";
import MyUserReducer from "./reducers/MyUserReducer";
import Register from "./components/Register";
import MyCartCounterReducer from "./reducers/MyCartCounterReducer";
import Cart from "./components/Cart";
import cookie from "react-cookies";
import FoodItemDetails from "./components/FoodItemDetails";
import 'moment/locale/vi'
import Profile from "./components/Profile";
import OrderHistory from "./components/OrderHistory";
import ChangePassword from "./components/ChangePassword";
import RegisterRestaurant from "./components/RegisterRestaurant";
import Restaurant from "./components/Restaurant";
import RestaurantDetails from "./components/RestaurantDetails";

export const MyUserContext = createContext();
export const MyCartContext = createContext();

const countCart = () => {
  let cart = cookie.load("cart") || null
  if (cart !== null)
    return Object.values(cart).reduce((init, current) => init + current["quantity"], 0);
  return 0;
}

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, cookie.load("user") || null);
  const [cartCounter, cartDispatch] = useReducer(MyCartCounterReducer, countCart());

  return (
    <MyUserContext.Provider value={[user, dispatch]}>
      <MyCartContext.Provider value={[cartCounter, cartDispatch]}>
        <BrowserRouter>
          <Header />
          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/fooddetails/:foodId" element={<FoodItemDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orderhistory" element={<OrderHistory />} />
              <Route path="/changepassword" element={<ChangePassword />} />
              <Route path="/registerrestaurant" element={<RegisterRestaurant />} />
              <Route path="/restaurant" element={<Restaurant />} />
              <Route path="/restaurants/:restaurantId" element={<RestaurantDetails />} />

            </Routes>
          </Container>
          <Footer />
        </BrowserRouter>
      </MyCartContext.Provider>
    </MyUserContext.Provider>
  )
}

export default App;
