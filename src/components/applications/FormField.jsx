// tiny wrapper — keeps field markup DRY across the form
export default function FormField({ label, error, required, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest">
        {label}
        {required && <span className="text-blue-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-500">
          <span className="inline-block w-1 h-1 rounded-full bg-red-400 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}