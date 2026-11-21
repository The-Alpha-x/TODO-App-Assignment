
export default function AppShell({ children }) {
  return (
    <div className="flex h-dvh flex-col bg-slate-50 text-slate-900">
      <main id="main" className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
