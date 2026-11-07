import { Navigate } from "react-router-dom";

function UnProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    if (token) {
        return <Navigate to="/blog" replace />;
    }
    return children;
}

export default UnProtectedRoute;