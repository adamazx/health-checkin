export default function ChartCard({ title, subtitle, isEmpty, children }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          {!!subtitle && (
            <p className="text-xs mt-0.5 text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="h-64 grid place-items-center">
        {isEmpty ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            ยังไม่มีข้อมูลแสดงกราฟ
          </div>
        ) : (
          <div className="w-full h-full">{children}</div>
        )}
      </div>
    </div>
  );
}
