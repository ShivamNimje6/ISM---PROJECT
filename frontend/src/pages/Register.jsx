import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useState } from "react";
import axios from "axios";
import { URL } from "../url";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // const handleRegister = async () => {
  //   if (!username || !email || !password) {
  //     setError("All fields are required.");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const res = await axios.post(URL + "/api/auth/register", {
  //       username,
  //       email,
  //       password,
  //     });
  //     setUsername("");
  //     setEmail("");
  //     setPassword("");
  //     setError("");
  //     navigate("/login");
  //   } catch (err) {
  //     setError(err.response?.data?.message || "Something went wrong");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(URL + "/api/auth/register", {
        username,
        email,
        password,
      });
      setUsername("");
      setEmail("");
      setPassword("");
      setError("");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 md:px-[200px] py-4">
        <h1 className="text-lg md:text-xl font-extrabold">
          <Link to="/">Blog Market</Link>
        </h1>
        <h3>
          <Link to="/login">Login</Link>
        </h3>
      </div>
      <div className="w-full flex justify-center items-center h-[80vh] ">
        <div className="flex flex-col justify-center items-center space-y-4 w-[80%] md:w-[25%]">
          <h1 className="text-xl font-bold text-left">Create an account</h1>
          <input
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border-2 border-black outline-0"
            type="text"
            placeholder="Enter your username"
            value={username}
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border-2 border-black outline-0"
            type="email"
            placeholder="Enter your email"
            value={email}
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border-2 border-black outline-0"
            type="password"
            placeholder="Enter your password"
            value={password}
          />
          <button
            onClick={handleRegister}
            className="w-full px-4 py-4 text-lg font-bold text-white bg-black rounded-lg hover:bg-gray-500 hover:text-black "
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          {error && <h3 className="text-red-500 text-sm">{error}</h3>}
          <div className="flex justify-center items-center space-x-3">
            <p>Already have an account?</p>
            <p className="text-gray-500 hover:text-black">
              <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
