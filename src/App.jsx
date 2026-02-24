import { useEffect} from 'react';
import { Routes , Route} from 'react-router-dom' ;
import { Provider } from 'react-redux';
import  store  from './store/store';

import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import ProtectedRoute from './pages/ProtectedRoute';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { clearUser, setUser } from './store/userSlice';
import { useNavigate } from 'react-router-dom';
import TracksVirtualized from './components/track/TracksVirtualized';
import AlbumsVirtualized from './components/album/AlbumsVirtualized';
import ArtistsVirtualized from './components/artist/ArtistsVirtualized';
import AlbumDisplay from './components/album/AlbumDisplay';
import SearchResults from './components/SearchResults';
import ArtistDisplay from './components/artist/ArtistDisplay';




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
        <Route path='/' element={<Home/>}/>
        <Route path='/tracks' element={<TracksVirtualized/>}/>
        <Route path='/albums' element={<AlbumsVirtualized/>}/>
        <Route path='/album/:id' element={<AlbumDisplay/>}/>
        <Route path='/artists' element={<ArtistsVirtualized/>}/>
        <Route path='/artist/:id' element={<ArtistDisplay/>}/>
        <Route path='/search' element={<SearchResults/>}/>
      </Route>

      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
      </Routes>
   
  )
}

export default App;
