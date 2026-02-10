import { useEffect} from 'react';
import { Routes , Route} from 'react-router-dom' ;
import { Provider } from 'react-redux';
import  store  from './store/store';

import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { clearUser, setUser } from './store/userSlice';
import { useNavigate } from 'react-router-dom';
import TracksVirtualized from './components/TracksVirtualized';




function App() {

  const dispatch = useDispatch()
  const bootStrapped = useSelector(state => state.user.bootStrapped);
  const navigate = useNavigate()


  useEffect(() => {
    if (bootStrapped) return;

    axios.get("http://localhost:8080/auth/me", { withCredentials: true })
      .then(res => {
        if (!res.data || !res.data.id) {
          dispatch(clearUser());
          navigate("/login");
          return;
        }

        dispatch(setUser({
        id: res.data.id,
        username: res.data.username,
        }));
      })
      .catch(() => {
        dispatch(clearUser());
        navigate("/login");
      })

    }, [bootStrapped, dispatch, navigate]
  );


  return (
  
      <Routes>
      <Route element={<ProtectedRoute/>}>
        <Route path='/' element={<TracksVirtualized/>}/>
      </Route>


      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
      </Routes>
   
  )
}

export default App;
