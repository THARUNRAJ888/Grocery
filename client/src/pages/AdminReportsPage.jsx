import { useEffect, useState } from "react";
import api from "../lib/api";

const AdminReportsPage = () => {
  const [range, setRange] = useState("monthly");
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await api.get("/api/reports/sales", { params: { range } });
    setData(res.data.data);
  };

  useEffect(() => {
    fetchData();
  }, [range]);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Sales Reports</h2>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100 space-y-2">
        {data.map((row) => (
          <div key={`${row._id.year}-${row._id.month || "y"}`} className="flex justify-between text-sm text-slate-700">
            <span>
              {row._id.month ? `${row._id.month}/${row._id.year}` : row._id.year} • {row.orders} orders
            </span>
            <span>${row.totalSales.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <a
          href={`${apiUrl}/api/reports/sales.csv?range=${range}`}
          className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          Export CSV
        </a>
        <a
          href={`${apiUrl}/api/reports/sales.pdf?range=${range}`}
          className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          Export PDF
        </a>
      </div>
    </div>
  );
};

export default AdminReportsPage;

