import { useState } from "react";
import api from "../lib/api";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/api/contact", form);
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <h2 className="text-2xl font-bold text-slate-800">Contact Us</h2>
      <p className="text-sm text-slate-600">We will get back within 24 hours.</p>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <input
          required
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <textarea
          required
          placeholder="Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          rows={4}
        />
        <button
          type="submit"
          className="w-full rounded-full bg-primary-600 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-700"
        >
          Send
        </button>
        {sent && <p className="text-sm text-primary-700">Message sent!</p>}
      </form>
    </div>
  );
};

export default ContactPage;

