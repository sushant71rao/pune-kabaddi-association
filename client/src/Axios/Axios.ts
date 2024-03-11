import axios from "axios";

let Axios = axios.create({
  baseURL: "https://api.insidekeys.com/",
  withCredentials: true,
});

export default Axios;
