export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      <main className="mx-auto max-w-5xl px-6 py-20 space-y-12">
        <header className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            Jacob Horne
          </h1>
          <p className="max-w-2xl text-lg text-neutral-300">
            Building, researching, and teaching technology to help others and solve problems.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          {[
            ["Building", "Shipping software and systems"],
            ["Researching", "Applied AI and evaluation"],
            ["Teaching", "Robotics, cybersecurity, mentoring"],
            ["Projects", "Case studies and project library"],
          ].map(([title, desc]) => (
            <div
              key={title}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 hover:border-neutral-700 transition"
            >
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-neutral-400">{desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
