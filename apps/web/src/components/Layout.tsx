import { NavLink, Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar__inner">
          <NavLink className="brand" to="/" aria-label="MiniCRM – přehled">
            <span className="brand__mark" aria-hidden="true">
              M
            </span>
            <span>MiniCRM</span>
          </NavLink>
          <nav className="navigation" aria-label="Hlavní navigace">
            <NavLink to="/" end>
              Přehled
            </NavLink>
            <NavLink to="/kontakty">Kontakty</NavLink>
            <NavLink to="/firmy">Firmy</NavLink>
          </nav>
        </div>
      </header>
      <main className="page-container">
        <Outlet />
      </main>
    </div>
  );
}
