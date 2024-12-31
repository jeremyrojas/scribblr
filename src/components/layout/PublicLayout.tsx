import { ErrorBoundary } from "@/components/ui/error-boundary";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <ErrorBoundary>
        <div className="max-w-3xl mx-auto">
          {children}
        </div>
      </ErrorBoundary>
    </div>
  );
}