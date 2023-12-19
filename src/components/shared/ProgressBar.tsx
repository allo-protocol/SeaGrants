export default function ProgressBar(props: {current: number, total: number}) {
  return (
    <div>
      <div className="mt-2" aria-hidden="true">
        <div className="overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-indigo-600"
            style={{ width: `${(props.current * 100 ) / props.total}%` }}
          />
        </div>
        <div className="mt-2 hidden grid-cols-3 text-sm font-medium text-gray-600 sm:grid">
          <div className="text-indigo-600">0</div>
          <div className="text-center text-indigo-600">{props.current}</div>
          <div className="text-right">{props.total}</div>
        </div>
      </div>
    </div>
  );
}
