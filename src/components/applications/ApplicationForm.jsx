import { useForm, Controller } from 'react-hook-form'
import {
  Building2, Briefcase, MapPin, Link2,
  FileText, ChevronDown, Loader2
} from 'lucide-react'
import FormField from './FormField'

const STATUSES = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected']

const STATUS_META = {
  Applied:   { color: 'bg-blue-50 text-blue-600 ring-blue-200'   },
  Screening: { color: 'bg-violet-50 text-violet-600 ring-violet-200' },
  Interview: { color: 'bg-amber-50 text-amber-600 ring-amber-200' },
  Offer:     { color: 'bg-emerald-50 text-emerald-600 ring-emerald-200' },
  Rejected:  { color: 'bg-red-50 text-red-500 ring-red-200'      },
}

const inputBase = `
  w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800
  placeholder:text-gray-400 transition-all duration-150
  focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100
`

const inputError = `border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-red-100`

// default values so the form works for both add and edit
const defaults = {
  company:      '',
  role:         '',
  location:     '',
  status:       'Applied',
  salary:       '',
  link:         '',
  notes:        '',
}

export default function ApplicationForm({ onSubmit, onCancel, initial, loading }) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: initial ? { ...defaults, ...initial } : defaults,
  })

  const watchedStatus = watch('status')

  const submit = (data) => {
    // strip empty strings from optional fields
    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== '')
    )
    onSubmit(cleaned)
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-5">

      {/* row 1 — company + role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Company" error={errors.company?.message} required>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Google, Apple…"
              className={`${inputBase} pl-9 ${errors.company ? inputError : ''}`}
              {...register('company', {
                required: 'Company name is required',
                minLength: { value: 2, message: 'At least 2 characters' },
                maxLength: { value: 80, message: 'Too long' },
              })}
            />
          </div>
        </FormField>

        <FormField label="Role / Position" error={errors.role?.message} required>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Frontend Engineer…"
              className={`${inputBase} pl-9 ${errors.role ? inputError : ''}`}
              {...register('role', {
                required: 'Role is required',
                minLength: { value: 2, message: 'At least 2 characters' },
                maxLength: { value: 100, message: 'Too long' },
              })}
            />
          </div>
        </FormField>
      </div>

      {/* row 2 — location + salary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Location" error={errors.location?.message}>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Remote, Mumbai…"
              className={`${inputBase} pl-9 ${errors.location ? inputError : ''}`}
              {...register('location', {
                maxLength: { value: 80, message: 'Too long' },
              })}
            />
          </div>
        </FormField>

        <FormField label="Salary / Range" error={errors.salary?.message}>
          <input
            type="text"
            placeholder="₹18–22 LPA, $120k…"
            className={`${inputBase} ${errors.salary ? inputError : ''}`}
            {...register('salary', {
              maxLength: { value: 60, message: 'Too long' },
            })}
          />
        </FormField>
      </div>

      {/* status pills — controlled via Controller */}
      <FormField label="Status" error={errors.status?.message} required>
        <Controller
          name="status"
          control={control}
          rules={{ required: 'Pick a status' }}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {STATUSES.map(s => {
                const active = field.value === s
                const meta   = STATUS_META[s]
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => field.onChange(s)}
                    className={`
                      px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150
                      ${active
                        ? `${meta.color} ring-1 ring-offset-1 shadow-sm scale-[1.04]`
                        : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300 hover:text-gray-600'
                      }
                    `}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          )}
        />
      </FormField>

      {/* job link */}
      <FormField label="Job Posting URL" error={errors.link?.message}>
        <div className="relative">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="url"
            placeholder="https://jobs.company.com/role"
            className={`${inputBase} pl-9 ${errors.link ? inputError : ''}`}
            {...register('link', {
              pattern: {
                value: /^https?:\/\/.+\..+/,
                message: 'Enter a valid URL starting with http:// or https://',
              },
            })}
          />
        </div>
      </FormField>

      {/* notes */}
      <FormField label="Notes" error={errors.notes?.message}>
        <div className="relative">
          <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
          <textarea
            rows={3}
            placeholder="Referral contact, interview date, salary discussed…"
            className={`${inputBase} pl-9 resize-none ${errors.notes ? inputError : ''}`}
            {...register('notes', {
              maxLength: { value: 500, message: 'Max 500 characters' },
            })}
          />
        </div>
      </FormField>

      {/* actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium
              text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg
            bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed
            text-white text-sm font-semibold transition-all duration-150 shadow-sm
            active:scale-[0.98]"
        >
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
            : initial ? 'Save Changes' : 'Add Application'
          }
        </button>
      </div>
    </form>
  )
}