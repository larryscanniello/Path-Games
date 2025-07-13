import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect,useContext } from "react";
import { AuthContext } from './AuthProvider'

//This component wraps around any component that requires a login
//so that account requirements to view a page are enforced

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useContext(AuthContext);

    //When component is first loaded, calls auth() to check if user is authorized - sets isAuthorized to false if not
    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    //Gets a new access token using the refresh token
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post("token/refresh/", {
                refresh: refreshToken,
            });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    };

    //Checks access token to see if it is expired, calls refreshToken() if token is expired
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000; //so date is in seconds not milliseconds

        if (tokenExpiration < now) {
            const refreshed = await refreshToken();

        } else {
            setIsAuthorized(true);
        }
    };

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/nickname" />;
}

export default ProtectedRoute;
