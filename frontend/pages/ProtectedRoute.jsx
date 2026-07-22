import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
// import axios from "axios";
import api from "../utils/axios";

const ProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setuser] = useState();

    useEffect(() => {
        api.get("/dashboard")
        .then((res)=>{
            setAuthenticated(true);
            setuser(res.data.user);
        })
        .catch(()=>{
            setAuthenticated(false);
        })
        .finally(()=>{
            setLoading(false);
        })

    }, []);

    if (loading) return <h1>Loading...</h1>;

    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    return children(user);
};

export default ProtectedRoute;