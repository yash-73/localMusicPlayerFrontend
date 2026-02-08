    import { useDispatch } from "react-redux"
    import {User} from 'lucide-react'
    import { useState } from "react"
    import axios from 'axios';
    import {Link} from 'react-router-dom'

    const Register = ()=>{


        const baseUrl = 'http://localhost:8080'
        const [username , setUsername] = useState('')
        const [password , setPassword] = useState('')
        const [confirmPassword , setConfirmPassword] = useState('')
        const [error, setError] = useState('');
        const [loading , setLoading] = useState(false);

        const dispatch = useDispatch()

        const handleSubmit = (e)=>{
            e.preventDefault();
            
            if(password != confirmPassword){
                setError('passwords do not match');
            }
            else{
                axios.post(`${baseUrl}/auth/register` , 
                    {
                        username: username,
                        password: password,
                    })
                    .then(res => {
                        console.log(res.data);
                    })
                    .catch(err => {
                        setError(err.response.data.message);
                        
                    })
            }

        }


        const inputClass = 'w-[80%] py-3 px-2 pl-4 my-2 outline-none border-[1px]  border-gray-500 rounded-md focus:bg-[#611a7d] focus:border-white  text-white'  

        return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-[#3b0e5f]">
            <div className="bg-[#611a7d]/50 sm:w-[500px] max-sm:w-full h-[600px] flex flex-col items-center justify-between rounded-2xl border-[1px] border-purple-400 shadow-purple-800 shadow-sm">


                <div className="flex flex-col w-full items-center h-[50%] justify-evenly ">
                    <h2 className="text-3xl font-semibold text-black"> Create Profile</h2>
                    <User strokeWidth={"1px"} className="border-[6px] border-black rounded-full h-[150px] w-[150px] "/>
                                
                </div>

                <form action="submit" className="flex flex-col justify-evenly items-center p-4 w-full" onSubmit={handleSubmit}>

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

                <input 
                        type="password"  
                        value={confirmPassword} 
                        onChange={(e)=>{setConfirmPassword(e.target.value); setError('')}} 
                        className={inputClass} 
                        placeholder="confirm password"
                        minLength="3"
                        maxLength="20"
                />

                <button className="px-10 py-4 rounded-xl text-white font-semibold border-[1px] border-purple-900 hover:bg-purple-300 
                            duration-300 hover:text-black cursor-pointer  border-2 border-black bg-[#140e24] my-2 "

                            type="submit"

                            >
                            Register
                </button>

                <p>
                    Already have an account ? <Link to={"/login"} className="underline hover:text-purple-800">Login</Link>
                </p>

                

                </form>
            </div>
            </div>
        )
    }


    export default Register;