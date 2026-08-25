import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="not-found">
      <p className="eyebrow">404</p>
      <h1>Stránka nebyla nalezena</h1>
      <p>Zkontrolujte adresu nebo se vraťte na přehled.</p>
      <Link className="button button--primary" to="/">
        Zpět na přehled
      </Link>
    </section>
  );
}
