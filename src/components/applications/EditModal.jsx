import { useEffect, useRef } from 'react'
import { X, Pencil } from 'lucide-react'
import ApplicationForm from './ApplicationForm'

export default function EditModal({ open, onClose, onSave, application, loading }) {
  const overlayRef = useRef(null)

  // close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // click outside to close
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  if (!open || !application) return null

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center
        bg-black/40 backdrop-blur-[2px] p-0 sm:p-4"
    >
      <div className="relative w-full sm:max-w-lg bg-white
        rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden
        animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">

        {/* header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Pencil className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-gray-900">Edit Application</h2>
            <p className="text-xs text-gray-400 mt-0.5 truncate">
              {application.company} — {application.role}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="w-8 h-8 flex items-center justify-center rounded-lg
              text-gray-400 hover:text-gray-600 hover:bg-gray-100
              disabled:opacity-40 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* scrollable body */}
        <div className="overflow-y-auto max-h-[80vh] px-6 py-5">
          <ApplicationForm
            initial={application}
            onSubmit={onSave}
            onCancel={onClose}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}