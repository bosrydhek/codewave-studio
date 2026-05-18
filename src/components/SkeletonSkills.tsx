import React from 'react'

const SkeletonSkills = () => {
  return (
    <div className="animate-in fade-in grid gap-4 duration-500">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#0a0a0a] p-5"
        >
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-white/5 p-2.5" />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-3/4 animate-pulse rounded-lg bg-white/5" />
              <div className="h-3 w-1/2 animate-pulse rounded-lg bg-white/5" />
            </div>
          </div>
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />
        </div>
      ))}
    </div>
  )
}

export default SkeletonSkills
