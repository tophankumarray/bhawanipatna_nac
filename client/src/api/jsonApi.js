import axios from "axios";

const jsonApi = axios.create({
  baseURL: "http://localhost:3000",
});

export default jsonApi;
