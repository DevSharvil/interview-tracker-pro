import { useState } from 'react'

// single hook that manages both modal states
// use this in any page that needs edit + delete
export function useAppActions() {
  const [editTarget,   setEditTarget]   = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  return {
    // edit
    editTarget,
    openEdit:  (app) => setEditTarget(app),
    closeEdit: ()    => setEditTarget(null),
    editOpen:  !!editTarget,

    // delete
    deleteTarget,
    openDelete:  (app) => setDeleteTarget(app),
    closeDelete: ()    => setDeleteTarget(null),
    deleteOpen:  !!deleteTarget,
  }
}