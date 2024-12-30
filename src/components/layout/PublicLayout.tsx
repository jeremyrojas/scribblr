export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-8">{children}</div>
    </main>
  );
}