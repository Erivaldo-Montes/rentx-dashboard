import Image from 'next/image'

export function Header() {
  return (
    <div className="bg-gray-100 w-full py-6 drop-shadow-lg">
      <div className=" flex flex-row ml-40">
        <Image
          src="https://media.istockphoto.com/id/1322220448/photo/abstract-digital-futuristic-eye.jpg?s=612x612&w=0&k=20&c=oAMmGJxyTTNW0XcttULhkp5IxfW9ZTaoVdVwI2KwK5s="
          alt="user image"
          width={40}
          height={40}
          className="w-16 h-16 rounded-full"
        />
        <div className="ml-5">
          <p className="text-main">Erivaldo montes</p>
          <p className="text-subtitle">Admin</p>
        </div>
      </div>
    </div>
  )
}
