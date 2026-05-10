export default function SafetyNotice() {
  return (
    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
      <div className="font-semibold">Privacy-first processing</div>
      <p className="mt-1">
        This utility is designed to process Excel files inside the browser. Your
        original file remains unchanged.
      </p>
    </div>
  );
}
