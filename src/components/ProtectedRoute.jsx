import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Controls from "./Controls";

const ProtectedRoute = () => {

  
  const { isAuthenticated, bootStrapped } = useSelector(
    state => state.user
  );

  if (!bootStrapped) {
    return <div>Loading....</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <div className="flex flex-col w-full items-center min-h-screen justify-center bg-[#3b0e5f]">
  <Outlet />
  <Controls className='m-4 fixed bottom-0 self-center'/>
  </div>;
};

export default ProtectedRoute;
