import { Sidebar } from '../../../components/sidebar'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row h-full w-full">
      <Sidebar />
      <div className="">{children}</div>
    </div>
  )
}
