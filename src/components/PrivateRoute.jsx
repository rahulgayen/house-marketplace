import { useAuthStatus } from "../hooks/useAuthStatus";
import { Outlet, Navigate } from "react-router-dom";
const PrivateRoute = () => {
    const { isLoading, authStatus } = useAuthStatus();
    if (isLoading) {
        return <h2>Loading...</h2>
    }

    return authStatus ? <Outlet /> : <Navigate to='/signin' />

};
export default PrivateRoute

