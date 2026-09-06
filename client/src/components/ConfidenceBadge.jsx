export default function ConfidenceBadge({ score }) {
  if (score === undefined || score === null) return null;

  const percentage = Math.round(score * 100);

  let variantStyles = "bg-emerald-50 text-emerald-700 border-emerald-200";
  let dotColor = "bg-emerald-500";
  let label = "High Confidence";

  if (percentage < 60) {
    variantStyles = "bg-rose-50 text-rose-700 border-rose-200";
    dotColor = "bg-rose-500";
    label = "Low Confidence (Verify)";
  } else if (percentage < 80) {
    variantStyles = "bg-amber-50 text-amber-700 border-amber-200";
    dotColor = "bg-amber-500";
    label = "Moderate (Review)";
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border shadow-sm transition-all ${variantStyles}`}
      title={`NLLB Model Confidence: ${percentage}%`}
    >
      <span className={`w-2 h-2 rounded-full ${dotColor} animate-pulse`} />
      <span>{label}</span>
      <span className="opacity-75 font-mono">({percentage}%)</span>
    </div>
  );
}
