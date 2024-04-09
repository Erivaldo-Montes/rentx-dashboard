'use client'

import { ArrowLeft } from '@phosphor-icons/react'
import { CarImages } from '@/components/carImages'

export default function CarDetails({ params }: { params: { id: string } }) {
  return (
    <div className="bg-gray-100 h-screen">
      <header className="w-full py-[2.5rem] px-[3.75rem]">
        <ArrowLeft size={20} />
      </header>
      <main className="px-[20rem]">
        <p>Informações do carro</p>
        <div className="flex flex-row gap-5">
          <CarImages />

          <div className="bg-white  px-[2.5rem] py-[4rem] w-full">
            <p className="text-xl">
              <span className="text-gray-500 text-base">nome</span> Onix
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
