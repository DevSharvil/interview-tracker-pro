import { useEffect } from 'react'
import { X } from 'lucide-react'
import ApplicationForm from './ApplicationForm'

export default function ApplicationModal({ open, onClose, onSave, initial, loading }) {
  // close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* panel */}
      <div className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl
        shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-200">

        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {initial ? 'Edit Application' : 'Add Application'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {initial ? 'Update the details below' : 'Track a new job application'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg
              text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* scrollable form body */}
        <div className="overflow-y-auto max-h-[80vh] px-6 py-5">
          <ApplicationForm
            onSubmit={onSave}
            onCancel={onClose}
            initial={initial}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}