import { useEffect, useRef } from 'react'
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react'

export default function DeleteConfirm({ open, onClose, onConfirm, application, loading }) {
  const confirmBtnRef = useRef(null)

  // focus confirm button when it opens
  useEffect(() => {
    if (open) {
      setTimeout(() => confirmBtnRef.current?.focus(), 50)
    }
  }, [open])

  // close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === 'Escape' && !loading) onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, loading, onClose])

  if (!open || !application) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center
      bg-black/40 backdrop-blur-[2px] p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden
        animate-in zoom-in-95 duration-150">

        {/* top accent bar */}
        <div className="h-1 bg-gradient-to-r from-red-400 to-red-500" />

        <div className="p-6">
          {/* icon */}
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center
            justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>

          {/* text */}
          <div className="text-center mb-6">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Delete this application?
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              You're about to delete
            </p>
            <div className="mt-2.5 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-sm font-semibold text-gray-800">{application.company}</p>
              <p className="text-xs text-gray-500 mt-0.5">{application.role}</p>
              {application.location && (
                <p className="text-xs text-gray-400 mt-0.5">{application.location}</p>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              This action is permanent and cannot be undone.
            </p>
          </div>

          {/* buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm
                font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300
                disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Keep it
            </button>
            <button
              ref={confirmBtnRef}
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5
                rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold
                disabled:opacity-60 disabled:cursor-not-allowed transition-colors
                shadow-sm shadow-red-100 active:scale-[0.98]"
            >
              {loading
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Deleting…</>
                : <><Trash2 className="w-3.5 h-3.5" /> Yes, delete</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}