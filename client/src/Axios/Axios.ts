import axios from "axios";

let Axios = axios.create({
  baseURL: "http://62.72.30.207:8000",
  withCredentials: true,
});

export default Axios;
