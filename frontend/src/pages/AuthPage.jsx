import React, { useState } from "react";

export default function AuthPage() {
  const [tab, setTab] = useState("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="w-[420px] bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-zinc-800/20">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-4 text-sm font-semibold transition ${
              tab === "login"
                ? "text-blue-600 border-b-2 border-zinc-800/20 border-blue-600"
                : "text-slate-500 border-zinc-800/20 hover:text-slate-700"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setTab("signup")}
            className={`flex-1 py-4 text-sm font-semibold transition ${
              tab === "signup"
                ? "text-blue-600 border-b-2 border-blue-600 border-blue-800/20"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {tab === "login" ? <LoginForm /> : <SignupForm />}
        </div>
      </div>
    </div>
  );
}

import { useLogin, useRegister } from "../hooks/auth/useLogin";
import { useNavigate } from "react-router";
import { useAuthContext } from "../context/AuthProvider";
import { api } from "../config/axios";

/* ---------------- LOGIN FORM ---------------- */
export function LoginForm() {
  const { setUser } = useAuthContext();
  const { mutateAsync, isPending, error } = useLogin();

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", formData);
      console.log(res.data);
      localStorage.setItem("user", JSON.stringify(res.data?.user));
      setUser(res.data.user);
      navigate("/admin/dashboard");
      // alert("Login Successful");
    } catch (error) {}
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">Welcome back 👋</h2>

      <p className="text-sm text-slate-500">Login to continue</p>

      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
        className="w-full px-4 py-2 border border-zinc-800/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        className="w-full px-4 py-2 border border-zinc-800/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {error && (
        <p className="text-sm text-red-500">
          {error?.message || "Login failed"}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        {isPending ? "Logging in..." : "Login"}
      </button>

      <p className="text-xs text-center text-slate-400">Forgot password?</p>
    </form>
  );
}

/* ---------------- SIGNUP FORM ---------------- */
export function SignupForm() {
  const { mutate, isPending, error } = useRegister();

  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">Create account ✨</h2>

      <p className="text-sm text-slate-500">Start your journey</p>

      <input
        type="text"
        name="full_name"
        value={formData.full_name}
        onChange={handleChange}
        placeholder="Full Name"
        className="w-full px-4 py-2 border border-zinc-800/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
        className="w-full px-4 py-2 border border-zinc-800/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full px-4 py-2 border border-zinc-800/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        className="w-full px-4 py-2 border border-zinc-800/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {error && (
        <p className="text-sm text-red-500">
          {error?.message || "Signup failed"}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-black transition disabled:opacity-50"
      >
        {isPending ? "Creating..." : "Sign Up"}
      </button>

      <p className="text-xs text-center text-slate-400">
        By signing up, you agree to terms
      </p>
    </form>
  );
}
