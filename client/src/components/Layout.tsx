import { NavLink, Outlet, useNavigate } from "react-router";

const navItems = [
  { to: "/home", label: "Home" },
  { to: "/orders", label: "Orders" },
  { to: "/products", label: "Products" },
  { to: "/payments", label: "Payments" },
  { to: "/customers", label: "Customers" },
];

const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      <aside className="w-64 border-r border-slate-800 bg-slate-900/80 backdrop-blur flex flex-col">
        <div className="px-5 py-6 border-b border-slate-800">
          <h1 className="text-lg font-semibold tracking-wide">CTSE POS</h1>
          <p className="mt-1 text-xs text-slate-400">Dashboard</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-400/40"
                    : "text-slate-300 hover:bg-slate-800 hover:text-slate-50"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 bg-slate-900/60 flex flex-col">
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
          <div>
            <h2 className="text-base font-semibold text-slate-100">Dashboard</h2>
            <p className="text-xs text-slate-400">Manage inventory, orders and customers</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 hover:border-slate-500 transition-colors"
          >
            Logout
          </button>
        </header>
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
