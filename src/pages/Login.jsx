import { useDispatch } from "react-redux"
import {User} from 'lucide-react'
import { useState } from "react"
import axios from 'axios';
import { setUser } from "../store/userSlice";
import { Link, useNavigate } from "react-router-dom";

const Login = ()=>{


    const baseUrl = 'localhost';
    const port  = '8080';
    const [username , setUsername] = useState('')
    const [password , setPassword] = useState('')
    const [error, setError] = useState('');
    const [loading , setLoading] = useState(false);

    const navigate = useNavigate();

    const dispatch = useDispatch()

   const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    await axios.post(
      `http://${baseUrl}:${port}/auth/login`,
      { username, password },
      { withCredentials: true }
    );

    const res = await axios.get(
      `http://${baseUrl}:${port}/auth/me`,
      { withCredentials: true }
    );

    dispatch(setUser({
      id: res.data.id,
      username: res.data.username,
    }));

    navigate('/');
  } catch (err) {
    if (err.response) {
      console.error(err.response);
    } else {
      console.error(err);
    }
  } finally {
    setLoading(false);
  }
};



    const inputClass = 'w-full py-3 px-4 outline-none border border-gray-200 bg-white text-black placeholder-gray-500 focus:border-red-600 focus:ring-1 focus:ring-red-300 transition-all'  

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white">
          <div className="sm:w-[480px] max-sm:w-full max-sm:h-screen bg-white border border-gray-200 flex flex-col items-center justify-between sm:p-12 max-sm:p-6 max-sm:rounded-none">
            <div className="flex flex-col w-full items-center gap-8">
              <h2 className="text-4xl font-bold text-black text-center">Login</h2>
              <User strokeWidth={1.5} className="border-2 border-black h-24 w-24 text-black" />
            </div>

            <form className="flex flex-col w-full gap-4 mt-8" onSubmit={handleSubmit}>
              {error.length > 0 && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-black">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  className={inputClass}
                  placeholder="Enter username"
                  pattern="[a-zA-Z0-9._]{3,20}"
                  minLength="3"
                  maxLength="20"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-black">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className={inputClass}
                  placeholder="Enter password"
                  minLength="3"
                  maxLength="20"
                  required
                />
              </div>

              <button
                className="w-full mt-6 px-6 py-3 bg-black text-white font-semibold border border-black hover:bg-red-700 transition-colors duration-200"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="text-sm text-gray-700 mt-6 text-center">
              Don't have an account?{' '}
              <Link to="/register" className="text-red-600 font-semibold hover:text-red-700 transition-colors">
                Register
              </Link>
            </p>
          </div>
        </div>
    )
}


export default Login;