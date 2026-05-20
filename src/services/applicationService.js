import { supabase } from '../lib/supabase'
import { handleError } from './serviceHelpers'

// ─── FETCH ────────────────────────────────────────────────────────────────────

/**
 * Fetch all applications for the logged-in user.
 * Ordered newest first.
 */
export async function fetchApplications(userId) {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) handleError(error, 'fetchApplications')
  return data
}

/**
 * Fetch a single application by id.
 */
export async function fetchApplicationById(id) {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('id', id)
    .single()

  if (error) handleError(error, 'fetchApplicationById')
  return data
}

// ─── ADD ──────────────────────────────────────────────────────────────────────

/**
 * Insert a new application row.
 * Returns the created row so the UI can optimistically prepend it.
 */
export async function addApplication(userId, formData) {
  const payload = {
    user_id:  userId,
    company:  formData.company.trim(),
    role:     formData.role.trim(),
    location: formData.location?.trim() || null,
    status:   formData.status   || 'Applied',
    salary:   formData.salary?.trim()   || null,
    link:     formData.link?.trim()     || null,
    notes:    formData.notes?.trim()    || null,
  }

  const { data, error } = await supabase
    .from('applications')
    .insert(payload)
    .select()
    .single()

  if (error) handleError(error, 'addApplication')
  return data
}

// ─── UPDATE ───────────────────────────────────────────────────────────────────

/**
 * Update an existing application by id.
 * Only sends fields that are actually present in formData (partial update safe).
 */
export async function updateApplication(id, formData) {
  const payload = {}

  const allowed = ['company', 'role', 'location', 'status', 'salary', 'link', 'notes']

  allowed.forEach(key => {
    if (key in formData) {
      const val = typeof formData[key] === 'string'
        ? formData[key].trim() || null
        : formData[key]
      payload[key] = val
    }
  })

  const { data, error } = await supabase
    .from('applications')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) handleError(error, 'updateApplication')
  return data
}

// ─── STATUS ───────────────────────────────────────────────────────────────────

/**
 * Update only the status field — used by quick-action dropdowns.
 */
export async function updateApplicationStatus(id, status) {
  const { data, error } = await supabase
    .from('applications')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) handleError(error, 'updateApplicationStatus')
  return data
}

// ─── DELETE ───────────────────────────────────────────────────────────────────

/**
 * Hard delete a single application by id.
 */
export async function deleteApplication(id) {
  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', id)

  if (error) handleError(error, 'deleteApplication')
  return true
}

// ─── STATS ────────────────────────────────────────────────────────────────────

/**
 * Return status counts for the dashboard stats cards.
 * Avoids pulling full rows just for counts.
 */
export async function fetchApplicationStats(userId) {
  const { data, error } = await supabase
    .from('applications')
    .select('status')
    .eq('user_id', userId)

  if (error) handleError(error, 'fetchApplicationStats')

  const counts = {
    total:     0,
    Applied:   0,
    Screening: 0,
    Interview: 0,
    Offer:     0,
    Rejected:  0,
  }

  data.forEach(row => {
    counts.total++
    if (row.status in counts) counts[row.status]++
  })

  return counts
}