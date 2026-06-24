export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">tactile-ui</p>
        <h1>Monorepo site skeleton</h1>
        <p className="subtitle">
          A minimal Next.js app inside a package-based monorepo.
        </p>
      </section>

      <section className="cards">
        <article className="card">
          <h2>Apps</h2>
          <p>The site lives under <code>apps/site</code>.</p>
        </article>
        <article className="card">
          <h2>Packages</h2>
          <p>The shared UI library lives under <code>packages/ui</code>.</p>
        </article>
        <article className="card">
          <h2>Next steps</h2>
          <p>Start building design tokens, components, and a theme system.</p>
        </article>
      </section>
    </main>
  );
}
