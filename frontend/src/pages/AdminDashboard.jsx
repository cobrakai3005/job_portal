import React from "react";
import SidebarItem from "../components/Sidebar/SidebarItem";
import { useAuthContext } from "../context/AuthProvider";
import DashboardContent from "../components/Dashboard/Jobs";
import { useSearchParams } from "react-router";
import Jobs from "../components/Dashboard/Jobs";
import Applications from "../components/Dashboard/Applications";
import Locations from "../components/Dashboard/Locations";
import { useLogout } from "../hooks/auth/useLogin";

export default function AdminDashboard() {
  const { user, setUser } = useAuthContext();
  const [search, setSearch] = useSearchParams();
  const { mutateAsync, isPending, error } = useLogout();
  const page = search.get("page");
  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside className="fixed inset-0 w-[260px] h-screen bg-white border-r border-zinc-800/20 shadow-sm flex flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-zinc-800/20">
          <h1 className="text-lg font-extrabold tracking-wide text-slate-800">
            ASIAN PAINT
          </h1>
          <p className="text-xs text-slate-400">Admin Dashboard</p>
        </div>

        {/* Logged-in User Card */}
        <div className="px-4 py-5 border-b border-zinc-800/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {user.username[0]}
          </div>

          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-800">
              {" "}
              {user.username}
            </p>
            <p className="text-xs text-slate-400"> {user.email}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <SidebarItem label="Jobs" />
          <SidebarItem label="Applications" />
          <SidebarItem label="Locations" />
        </nav>

        {/* Footer */}
        <button
          onClick={async () => {
            await mutateAsync();
            setUser(null);
            localStorage.removeItem("user");
          }}
          className="px-4 py-2 my-3 m-2 bg-red-500 hover:opacity-20 text-white rounded-md"
        >
          Logout
        </button>
        <div className="px-6 py-4  border-t border-zinc-800/20 text-xs text-slate-400">
          © 2026 Asian Paint
        </div>
      </aside>
      {/* Main Content */}
      <main className="ml-[300px] relative flex-1 bg-white flex flex-col">
        {/* Header */}
        <header className="h-16 sticky inset-0 bg-white shadow rounded-2xl flex items-center px-6 font-semibold">
          Admin Dashboard
        </header>

        {/* Page Content */}
        <section className="p-6 flex-1">
          {page === "jobs" && <Jobs />}
          {page === "applications" && <Applications />}
          {page === "locations" && <Locations />}
        </section>
      </main>
    </div>
  );
}
