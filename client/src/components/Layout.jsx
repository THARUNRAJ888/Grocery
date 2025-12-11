import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="absolute inset-0 -z-10 bg-grocery-gradient opacity-20" />
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
};

export default Layout;

