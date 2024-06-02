import { Sidebar } from '../../../../components/sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen bg-gray-100 relative">
      <Sidebar />
      <div className="">{children}</div>
    </div>
  )
}
