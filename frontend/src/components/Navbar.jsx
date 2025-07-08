import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileInfo from "./Cards/ProfileInfo";
import SearchBar from "./SearchBar/SearchBar";
import toast from "react-hot-toast";
// import axios from "../utils/axiosInstance.js";
import axios from "axios";

const Navbar = ({ searchQuery, setSearchQuery }) => {

  const navigate = useNavigate();

  // const handleSearch = () => {};

  const onClearSearch = () => {
    setSearchQuery("");
  };

  const onLogout = async()=> {
    try {
      await axios.get("/auth/api/logout", {
        withCredentials: true,
      });
      toast.success("UserLogged out successfully");
      navigate("/login");
      localStorage.removeItem("access_token");
    }
    catch(error) {
      console.log(error);
      toast.error("Error", error);
    }
  }

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <Link to={"/"}>
        <h2 className="text-xl font-medium text-black py-2">
          <span className="text-slate-500">Good</span>
          <span className="text-slate-900">Notes</span>
        </h2>
      </Link>

      <SearchBar
        value={searchQuery}
        onChange={({ target }) => setSearchQuery(target.value)}
        // handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />

      <ProfileInfo onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
