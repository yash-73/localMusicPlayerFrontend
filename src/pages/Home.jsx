import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TracksVirtualized from "../components/TracksVirtualized";
import Controls from "../components/Controls";
const Home = ()=>{

    const navigate = useNavigate(); 

    useEffect( ()=>{
        axios.get('http://localhost:8080/tracks/get/tracks' ,{withCredentials: true})
        .then((res)=>{
        })
        .catch(err => console.dir(err));
    })

    const handleInfo = async(e)=>{
            e.preventDefault();
            axios.get('http://localhost:8080/auth/me' , {withCredentials: true})
            .then(res => {
                console.dir(res.data);
            })
            .catch(err => console.dir(err));
    }

    return(
        <div className="">
        <div>Hello</div>
        <button onClick={handleInfo}>Get Info</button>
        </div>
    )
}

export default Home;