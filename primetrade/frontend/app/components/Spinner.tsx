// app/components/Spinner.tsx
export default function Spinner({ size = 24 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }} className="d-flex align-items-center justify-content-center">
      <div className="spinner-border" role="status" style={{ width: size, height: size }}>
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
