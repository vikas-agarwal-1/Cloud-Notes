
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3004/api/note",  
  withCredentials: true,                 
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
