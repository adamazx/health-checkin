export default function CustomTooltip({
  active,
  payload,
  label,
  labelKey,
  valueKey = "value",
  valueLabel = "จำนวน",
}) {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0];
  const displayLabel = labelKey ? p?.payload?.[labelKey] : label;
  const displayValue = valueKey ? p?.payload?.[valueKey] ?? p?.value : p?.value;

  return (
    <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 shadow-sm">
      <div className="text-xs font-medium text-gray-700 dark:text-gray-200">
        {displayLabel}
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-300">
        {valueLabel}: <span className="font-semibold">{displayValue}</span>
      </div>
    </div>
  );
}
