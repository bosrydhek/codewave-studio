import type { Metadata } from 'next'

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: 'Dashboard | Designwave',
  description:
    'Your Designwave command centre — manage projects, monitor system health, and get AI-powered suggestions.',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
