import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Mail, Lock, Eye, EyeOff, User, Briefcase, ArrowRight, Loader2, Check } from 'lucide-react'

const strength = (pw) => {
  let s = 0
  if (pw.length >= 8)         s++
  if (/[A-Z]/.test(pw))       s++
  if (/[0-9]/.test(pw))       s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}

const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']
const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-green-500']
const strengthText  = ['', 'text-red-500', 'text-amber-500', 'text-blue-500', 'text-green-600']

export default function Signup() {
  const { signup }  = useAuth()
  const navigate    = useNavigate()

  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' })
  const [show, setShow]       = useState({ pw: false, cf: false })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors]   = useState({})
  const [agreed, setAgreed]   = useState(false)

  const pwStrength = strength(form.password)

  const validate = () => {
    const e = {}
    if (!form.name.trim())  e.name    = 'Full name is required'
    if (!form.email)        e.email   = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password)     e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Minimum 8 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    if (!agreed) e.agreed = 'You must accept the terms'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handle = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await signup(form.name.trim(), form.email, form.password)
      toast.success('Account created! Check your email to confirm.')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: '' }))
  }

  const inputClass = (key) =>
    `w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all duration-200
     focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
     ${errors[key]
       ? 'border-red-300 bg-red-50/50'
       : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full opacity-40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 mb-4">
            <Briefcase className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="text-slate-500 text-sm mt-1">Start tracking your interviews for free</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-slate-200/60 border border-white/60 p-8">
          <form onSubmit={handle} className="space-y-4" noValidate>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text" value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="John Doe"
                  className={inputClass('name')}
                />
              </div>
              {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email" value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass('email')}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={show.pw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="Min. 8 characters"
                  className={`${inputClass('password')} pr-11`}
                />
                <button type="button" onClick={() => setShow(s => ({ ...s, pw: !s.pw }))}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {show.pw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength meter */}
              {form.password.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= pwStrength ? strengthColor[pwStrength] : 'bg-slate-100'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${strengthText[pwStrength]}`}>
                    {strengthLabel[pwStrength]} password
                  </p>
                </div>
              )}
              {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={show.cf ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={e => set('confirm', e.target.value)}
                  placeholder="Re-enter password"
                  className={`${inputClass('confirm')} pr-11`}
                />
                <button type="button" onClick={() => setShow(s => ({ ...s, cf: !s.cf }))}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {show.cf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {form.confirm && form.password === form.confirm && (
                  <Check className="absolute right-9 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                )}
              </div>
              {errors.confirm && <p className="mt-1.5 text-xs text-red-500">{errors.confirm}</p>}
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5 flex-shrink-0">
                  <input type="checkbox" checked={agreed} onChange={e => {
                    setAgreed(e.target.checked)
                    if (errors.agreed) setErrors(p => ({ ...p, agreed: '' }))
                  }} className="sr-only" />
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200
                    ${agreed ? 'bg-blue-600 border-blue-600' : 'border-slate-300 group-hover:border-blue-400'}`}>
                    {agreed && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                  </div>
                </div>
                <span className="text-sm text-slate-500 leading-relaxed">
                  I agree to the{' '}
                  <span className="text-blue-600 font-medium hover:underline cursor-pointer">Terms of Service</span>
                  {' '}and{' '}
                  <span className="text-blue-600 font-medium hover:underline cursor-pointer">Privacy Policy</span>
                </span>
              </label>
              {errors.agreed && <p className="mt-1.5 text-xs text-red-500">{errors.agreed}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700
                disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold
                py-3 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-blue-200
                hover:shadow-blue-300 active:scale-[0.98] mt-2"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
                : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}