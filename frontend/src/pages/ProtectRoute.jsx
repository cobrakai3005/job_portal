import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/AuthProvider";

export default function ProtectRoute({ children }) {
  try {
    const { user, isLoading } = useAuthContext();

    console.log(user);

    /* 
       LOADING
    - */

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      );
    }

    /* 
       NOT AUTHENTICATED
    - */

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    /* 
       AUTHORIZED
    - */

    return children;
  } catch (error) {
    console.error("Protected Route Error:", error);

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white shadow-lg rounded-xl p-6 w-[400px] text-center">
          <h1 className="text-2xl font-bold text-red-500">
            Something went wrong
          </h1>

          <p className="text-slate-500 mt-2">Failed to load protected route.</p>

          <button
            onClick={() => window.location.reload()}
            className="mt-5 bg-slate-900 text-white px-4 py-2 rounded-lg"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
}
