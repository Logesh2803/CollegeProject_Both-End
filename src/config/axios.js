import axios from "axios";

const baseURL = "http://localhost:4000/";

const app = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
});

export default app;
