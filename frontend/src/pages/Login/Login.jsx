import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    if (!password) {
      setError("Please Enter Password");
      return;
    }
    setError("");

    try {
      const { data } = await axios.post(
        "http://localhost:3004/auth/api/login",
        {
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
      toast.success(data.message||"User Loggedin");
      localStorage.setItem("access_token", data.token);
      navigate("/");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.log(err);
      toast.error(" Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center mt-28">
      <div className="w-96 border rounded bg-white px-7 py-10">
        <form onSubmit={handleLogin}>
          <h4 className="text-2xl mb-7">Login</h4>

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
            Login
          </button>

          <p className="text-sm text-center mt-4">
            Not Registered yet?{" "}
            <Link
              to={"/signup"}
              className="font-medium text-[#2b85FF] underline"
            >
              Create an Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
