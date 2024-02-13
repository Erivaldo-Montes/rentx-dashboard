import { Sidebar } from '../../../components/sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative bg-gray-100 pb-10 ">
      <Sidebar />
      <div className="">{children}</div>
    </div>
  )
}
