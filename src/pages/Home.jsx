import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Home = ()=>{

    const navigate = useNavigate(); 

   
    useEffect(()=>{
         navigate('/tracks');
    },[])
    return (
        <>
        </>
    )
}

export default Home;