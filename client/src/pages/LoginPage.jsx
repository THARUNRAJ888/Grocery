import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", inviteCode: "" });
  const [error, setError] = useState("");
  const { login, register, continueAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form);
      }
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const onGuest = async () => {
    await continueAsGuest();
    navigate("/products");
  };

  return (
    <div className="min-h-screen bg-grocery-gradient flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl rounded-3xl bg-white/90 p-6 shadow-2xl backdrop-blur">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-primary-800">Welcome to FreshCart</h1>
            <p className="mt-2 text-slate-600">
              Login, register, or continue as guest to start shopping fresh groceries.
            </p>
            <div className="mt-6 space-y-3">
              <button
                onClick={onGuest}
                className="w-full rounded-full bg-white px-4 py-3 text-sm font-semibold text-primary-700 shadow ring-1 ring-primary-200 hover:bg-primary-50"
              >
                Continue as Guest
              </button>
              <button
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="w-full rounded-full bg-primary-700 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-800"
              >
                {mode === "login" ? "Need an account? Register" : "Have an account? Login"}
              </button>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-inner space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-sm text-slate-600">Name</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
            )}
            <div>
              <label className="text-sm text-slate-600">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">Password</label>
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
              />
            </div>
            {mode === "register" && (
              <div>
                <label className="text-sm text-slate-600">Admin Invite Code (optional)</label>
                <input
                  type="text"
                  value={form.inviteCode}
                  onChange={(e) => setForm({ ...form, inviteCode: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
            )}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-full bg-primary-600 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-700"
            >
              {mode === "login" ? "Login" : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

