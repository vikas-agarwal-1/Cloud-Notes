import React from "react";
import { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axios from "axios";
import toast from 'react-hot-toast';

const Signup = () => {

  const[username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate();

  const handleSignup = async(e)=> {
    e.preventDefault();

    if(!username) {
      setError("Please enter your name");
      return 
    }

    if(!validateEmail(email)) {
      setError("Please enter a valid email")
        return
    }
    if(!password) {
      setError("Please Enter Password")
      return 
    }
    setError("");

    try {
      const { data } = await axios.post(
        "http://localhost:3004/auth/api/signup",
        {
          username,
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      console.log(data);
      toast.success("User Registered");
      localStorage.setItem("access_token", data.token);
      navigate("/login")
      setUsername('')
      setEmail("")
      setPassword("")
    } catch (error) {
      // if (err.response && err.response.data && err.response.data.error) {
      //   alert(err.response.data.error.join("\n")); // handles Zod multiple errors
      // } else if (
      //   err.response &&
      //   err.response.data &&
      //   err.response.data.message
      // ) {
      //   alert(err.response.data.message); // for normal single error messages
      // } else {
      //   alert("Something went wrong");
      // }
      console.log(error);
      toast.error(error.response.data.errors || "failed");
    }
  };


  return (
    <div className="flex items-center justify-center mt-28">
      <div className="w-96 border rounded bg-white px-7 py-10">
        <form onSubmit={handleSignup}>
          <h4 className="text-2xl mb-7">Sign Up</h4>

          <input
            type="text"
            placeholder="Name"
            className="input-box"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="text"
            placeholder="Email"
            className="input-box"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm pb-1">{error}</p>}

          <button type="submit" className="btn-primary">
            Signup
          </button>

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="font-medium text-[#2b85FF] underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
