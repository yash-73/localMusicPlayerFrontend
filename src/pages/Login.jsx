import { useDispatch } from "react-redux"
import {User} from 'lucide-react'
import { useState } from "react"
import axios from 'axios';
import { setUser } from "../store/userSlice";
import { Link, useNavigate } from "react-router-dom";
const Login = ()=>{


    const baseUrl = 'http://localhost:8080'
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
            const res = await axios.post(
            `${baseUrl}/auth/login`,
            { username, password },
            { withCredentials: true }
            );

            dispatch(setUser({
            id: res.data.id,
            username: username,
            isAuthenticated: true,
            }));

            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };



    const inputClass = 'w-[80%] py-3 px-2 pl-4 my-2 outline-none border-[1px]  border-gray-500 rounded-md focus:bg-[#611a7d] focus:border-white  text-white'  

    return (

        <div className="w-full h-[100vh] flex flex-col items-center justify-center bg-[#3b0e5f]">
        <div className="bg-[#611a7d]/50 sm:w-[500px] max-sm:w-full h-[600px] flex flex-col items-center justify-between rounded-2xl border-[1px] border-purple-400 shadow-purple-800 shadow-sm">


            <div className="flex flex-col w-full items-center h-[50%] justify-evenly ">
                <h2 className="text-3xl font-semibold text-black"> LogIn</h2>
                <User strokeWidth={"1px"} className="border-[6px] border-black rounded-full h-[150px] w-[150px] "/>
                             
            </div>

            <form className="flex flex-col justify-evenly items-center p-4 w-full" onSubmit={handleSubmit}>

                {error.length > 0 && <p className="text-red-400 bg-red-400/20 w-[80%] px-2 rounded-sm border-[1px] border-red-500 py-1" >{error}</p>}


            <input  
                    type="text" 
                    value={username} 
                    onChange={(e)=>{setUsername(e.target.value); setError('')}} 
                    className={inputClass} 
                    placeholder="username"
                    pattern="[a-zA-Z0-9._]{3,20}"
                    minLength="3"
                    maxLength="20"
                    required 
            />


            <input 
                    type="password"  
                    value={password} 
                    onChange={(e)=>{setPassword(e.target.value); setError('')}} 
                    className={inputClass} 
                    placeholder="password"
                    minLength="3"
                    maxLength="20"
            />

            <button className="px-10 py-4 rounded-xl text-white font-semibold border-[1px] border-purple-900 hover:bg-purple-300 
                        duration-300 hover:text-black cursor-pointer  border-2 border-black bg-[#140e24] my-2 "

                        type="submit"
                        disabled={loading}

                        >
                        {loading ? `Loading` : `Login`}
            </button>

            <p>
                Don't have an account? <Link to={"/register"} className="underline hover:text-purple-800"> register </Link>
            </p>
            

            </form>
        </div>

        </div>
    )
}


export default Login;