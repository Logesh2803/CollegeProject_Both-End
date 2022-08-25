import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import Product from "./pages/Product";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import Cart from "./pages/Cart";
import axios from "./config/axios";

import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

const App = () => {
  const [login, setLogin] = useState(false);

  const [cart, setCartProducts] = useState([]);

  useEffect(async () => {
    await axios
      .get("users/verify")
      .then((res) => (res.status == 200 ? setLogin(true) : setLogin(false)))
      .catch((err) => setLogin(false));

    const cart = await axios.get("users/cart").then((res) => res.data);

    setCartProducts(cart.data);
  }, []);

  return (
    <Router>
      <div>
        <Navbar login={login} cart={cart} />
        <Switch>
          <Route path="/cart">
            <Cart />
          </Route>
          <Route path="/product/:id" children={<Product />} />
          <Router path="/register">
            <Register />
          </Router>
          <Route path="/login">
            <Login />
          </Route>
          <Route path={"/"}>
            <ProductList />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
