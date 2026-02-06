import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("role", res.data.user.role);
      nav(res.data.user.role === "admin" ? "/admin" : "/student");
    } catch (e) {
      setErr(e.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex bg-blue-500 text-white items-center justify-center p-10">
        <div className="max-w-sm">
          <h1 className="text-3xl font-bold">Student Screening</h1>
          <p className="opacity-90 mt-2">
            Secure application submission + admin review.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 bg-slate-50">
        <form
          onSubmit={submit}
          className="w-full max-w-md bg-white rounded-2xl shadow p-6"
        >
          <h2 className="text-2xl font-semibold">Login</h2>
          {err && <p className="text-red-600 mt-2 text-sm">{err}</p>}

          <label className="block mt-4 text-sm">Email</label>
          <input
            className="w-full border rounded-xl p-2 mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="block mt-4 text-sm">Password</label>
          <input
            type="password"
            className="w-full border rounded-xl p-2 mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full mt-6 bg-blue-500 text-white rounded-2xl py-2 font-medium">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
