import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useApplications } from '../context/ApplicationContext'
import ApplicationsTable from '../components/applications/ApplicationsTable'
import ApplicationModal from '../components/applications/ApplicationModal'
import EditModal from '../components/applications/EditModal'
import DeleteConfirm from '../components/applications/DeleteConfirm'
import { useAppActions } from '../components/applications/useAppActions'
import Layout from '../components/layout/Layout'
import toast from 'react-hot-toast'

export default function Applications() {
  const {
    applications, loading,
    addApplication, updateApplication, deleteApplication
  } = useApplications()

  const [addOpen,  setAddOpen]  = useState(false)
  const [saving,   setSaving]   = useState(false)
  const [deleting, setDeleting] = useState(false)

  const {
    editTarget,  editOpen,  openEdit,  closeEdit,
    deleteTarget, deleteOpen, openDelete, closeDelete,
  } = useAppActions()

  // ── add ────────────────────────────────────────────────────────────────────
  const handleAdd = async (formData) => {
    setSaving(true)
    try {
      await addApplication(formData)
      toast.success('Application added!')
      setAddOpen(false)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  // ── edit ───────────────────────────────────────────────────────────────────
  const handleEdit = async (formData) => {
    setSaving(true)
    try {
      await updateApplication(editTarget.id, formData)
      toast.success('Changes saved')
      closeEdit()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  // ── delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteApplication(deleteTarget.id)
      toast.success(`Deleted ${deleteTarget.company}`)
      closeDelete()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-5">

        {/* header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Applications</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {applications.length} total application{applications.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
              text-white text-sm font-semibold px-4 py-2.5 rounded-lg
              transition-colors shadow-sm shadow-blue-100"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Application</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* table — passes openEdit and openDelete down */}
        <ApplicationsTable
          applications={applications}
          loading={loading}
          onAdd={() => setAddOpen(true)}
          onEdit={openEdit}
          onDelete={openDelete}   // ← passes full app object, not just id
        />
      </div>

      {/* add modal */}
      <ApplicationModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleAdd}
        loading={saving}
      />

      {/* edit modal */}
      <EditModal
        open={editOpen}
        onClose={closeEdit}
        onSave={handleEdit}
        application={editTarget}
        loading={saving}
      />

      {/* delete confirmation */}
      <DeleteConfirm
        open={deleteOpen}
        onClose={closeDelete}
        onConfirm={handleDelete}
        application={deleteTarget}
        loading={deleting}
      />
    </Layout>
  )
}