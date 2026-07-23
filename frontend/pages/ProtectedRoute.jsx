import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/axios";

const ProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get("/dashboard");
                setUser(res.data.user);
                setAuthenticated(true);
            } catch {
                setAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);
    if (loading) return <h1>Loading...</h1>;


    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    return typeof children === "function" ? children(user) : children;
};

export default ProtectedRoute;
