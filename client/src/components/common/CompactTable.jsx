export default function CompactTable({
  columns = [],
  rows = [],
  emptyText = "ไม่มีข้อมูล",
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-700/40 text-gray-600 dark:text-gray-200">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-3 py-2 text-left font-semibold">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {rows.length === 0 ? (
            <tr>
              <td className="px-3 py-4 text-gray-500" colSpan={columns.length}>
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((r, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50/70 dark:hover:bg-gray-700/30"
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className="px-3 py-2 text-gray-800 dark:text-gray-100"
                  >
                    {typeof c.render === "function" ? c.render(r) : r[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
