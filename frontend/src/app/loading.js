export default function Loading() {
  return (
    <div className="route-loader" role="status" aria-label="Loading page">
      <div className="route-loader__spinner" />

      <p>Loading your journey...</p>
    </div>
  );
}
