import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import {
  fetchApplications,
  addApplication      as svcAdd,
  updateApplication   as svcUpdate,
  updateApplicationStatus as svcStatus,
  deleteApplication   as svcDelete,
} from '../services/applicationService'

const ApplicationContext = createContext(null)

export function ApplicationProvider({ children }) {
  const { user } = useAuth()
  const [applications, setApplications] = useState([])
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState(null)

  useEffect(() => {
    if (user) load()
    else setApplications([])
  }, [user])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchApplications(user.id)
      setApplications(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function addApplication(formData) {
    const created = await svcAdd(user.id, formData)
    setApplications(prev => [created, ...prev])  // optimistic prepend
    return created
  }

  async function updateApplication(id, formData) {
    const updated = await svcUpdate(id, formData)
    setApplications(prev => prev.map(a => a.id === id ? updated : a))
    return updated
  }

  async function updateStatus(id, status) {
    const updated = await svcStatus(id, status)
    setApplications(prev => prev.map(a => a.id === id ? updated : a))
    return updated
  }

  async function deleteApplication(id) {
    await svcDelete(id)
    setApplications(prev => prev.filter(a => a.id !== id))
  }

  return (
    <ApplicationContext.Provider value={{
      applications,
      loading,
      error,
      addApplication,
      updateApplication,
      updateStatus,
      deleteApplication,
      refresh: load,
    }}>
      {children}
    </ApplicationContext.Provider>
  )
}

export const useApplications = () => useContext(ApplicationContext)