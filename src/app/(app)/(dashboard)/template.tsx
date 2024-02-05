import { Sidebar } from '../../../components/sidebar'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative bg-gray-100 h-full w-full">
      <Sidebar />
      <div className="">{children}</div>
    </div>
  )
}
