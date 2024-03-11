import axios from "axios";

let Axios = axios.create({
  baseURL: "https://www.api.insidekeys.com/",
  // baseURL: "http://localhsot:8000",
  withCredentials: true,
});

export default Axios;
