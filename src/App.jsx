import { useEffect} from 'react';
import { Routes , Route} from 'react-router-dom' ;
import { Provider } from 'react-redux';
import { store } from './store/store';

import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { clearUser, setUser } from './store/userSlice';




function App() {

  const dispatch = useDispatch()
  const bootStrapped = useSelector(state => state.user.bootStrapped);

  useEffect(()=>{
    if(bootStrapped) return;

    axios.get('http://localhost:8080/auth/isLoggedIn' ,{withCredentials: true})
        .then(res => {
          if(res.data.id == null){
            navigate('/login');
          }
          dispatch(setUser(
            {
              id: res.data.id,
              username: res.data.username,
            }
            
          ))

        }).catch(err => {
          dispatch(clearUser());
        })
  },[bootStrapped , dispatch])

  return (
  
      <Routes>
      <Route element={<ProtectedRoute/>}>
        <Route path='/' element={<Home/>}/>
      </Route>


      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
      </Routes>
   
  )
}

export default App
