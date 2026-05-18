import React, { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase'

export const ErrorLogPanel = ({ projectId }: { projectId: string }) => {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true)
      const sb = getSupabaseClient()
      
      const { data, error } = await sb
        .from('project_memory')
        .select('*')
        .eq('project_id', projectId)
        .eq('type', 'error')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setLogs(data)
      } else {
        console.warn('Failed to load error logs', error)
      }
      setLoading(false)
    }

    if (projectId) {
      fetchLogs()
    }
  }, [projectId])

  if (loading) {
    return <div className="p-4 text-text-muted">Loading logs...</div>
  }

  if (logs.length === 0) {
    return <div className="p-4 text-text-muted">No errors logged.</div>
  }

  return (
    <div className="p-4 flex flex-col gap-3 h-full overflow-y-auto">
      <h3 className="text-sm font-bold text-text-primary">Error Log & Fixes</h3>
      {logs.map((log) => (
        <div key={log.id} className="p-3 bg-error/10 border border-error/20 rounded-md">
          <p className="text-xs font-bold text-error mb-1">
            {new Date(log.created_at).toLocaleString()}
          </p>
          <p className="text-sm text-text-primary">{log.content}</p>
          {log.metadata?.severity && (
            <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold bg-error text-white rounded-full">
              {log.metadata.severity}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
