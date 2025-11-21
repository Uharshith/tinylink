export default function HealthPage() {
  return (
    <pre>
      {JSON.stringify({ ok: true, version: "1.0" }, null, 2)}
    </pre>
  );
}
