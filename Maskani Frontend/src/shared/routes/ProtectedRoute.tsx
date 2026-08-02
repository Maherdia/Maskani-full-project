import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";

interface Props {
    roles?: string[];
}

export default function ProtectedRoute({ roles }: Props) {

    const auth = useAuth();

    if (auth.loading) {
        return <p>Loading...</p>;
    }

    if (!auth.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (
        roles &&
        auth.user &&
        !roles.includes(auth.user.role)
    ) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}