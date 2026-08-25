export function LoadingState({ label = "Načítání…" }: { label?: string }) {
  return (
    <p className="state-message" aria-live="polite">
      {label}
    </p>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="alert alert--error" role="alert">
      {message}
    </div>
  );
}
