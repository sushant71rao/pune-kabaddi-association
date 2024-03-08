import axios from "axios";
let Axios = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

export default Axios;
