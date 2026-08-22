import { useAuthState } from "../context/AuthContext"
import { Navigate } from "react-router-dom"
import { ROUTES } from "../utils/constants"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { authState } = useAuthState()

    if (authState === "unauthenticated") {
        return <Navigate to={ROUTES.LOGIN} replace />
    }

    return children
}