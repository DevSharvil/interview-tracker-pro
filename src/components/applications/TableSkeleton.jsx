function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-100 animate-pulse shrink-0" />
          <div className="space-y-1.5">
            <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
            <div className="h-2.5 w-16 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </td>
      <td className="px-5 py-4"><div className="h-3 w-32 bg-gray-100 rounded animate-pulse" /></td>
      <td className="px-5 py-4"><div className="h-3 w-20 bg-gray-100 rounded animate-pulse" /></td>
      <td className="px-5 py-4"><div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" /></td>
      <td className="px-5 py-4"><div className="h-3 w-16 bg-gray-100 rounded animate-pulse" /></td>
      <td className="px-5 py-4">
        <div className="flex gap-1.5 justify-end">
          <div className="w-7 h-7 bg-gray-100 rounded-lg animate-pulse" />
          <div className="w-7 h-7 bg-gray-100 rounded-lg animate-pulse" />
          <div className="w-7 h-7 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </td>
    </tr>
  )
}

export default function TableSkeleton({ rows = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => <SkeletonRow key={i} />)}
    </>
  )
}