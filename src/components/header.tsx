import Image from 'next/image'
import { auth } from '@/lib/auth'
export async function Header() {
  const session = await auth()

  return (
    <div className="bg-gray-100 w-full py-6 drop-shadow-lg">
      <div className=" flex flex-row ml-[320px]">
        <Image
          src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="user image"
          width={40}
          height={40}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="ml-5">
          <p className="text-main">{session?.user?.name}</p>
          <p className="text-subtitle">Admin</p>
        </div>
      </div>
    </div>
  )
}
