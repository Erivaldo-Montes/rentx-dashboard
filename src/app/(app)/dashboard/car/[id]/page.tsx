'use client'

import { ArrowLeft } from '@phosphor-icons/react'
import { CarImages } from '@/components/carImages'
import { FieldCarInformation } from '@/components/fieldCar'
import { SpecificationCard } from '@/components/specificationCard'
import gasolinePng from '@/assets/energy.png'

import capacityPeoplePng from '@/assets/capacity-people.png'
import accelerationPng from '@/assets/acceleration.png'
import gearboxPng from '@/assets/gearbox.png'
import speedPng from '@/assets/speed.png'
import strenghtPng from '@/assets/strenght.png'

export default function CarDetails({ params }: { params: { id: string } }) {
  return (
    <div className="bg-gray-100  flex-grow">
      <header className="w-full py-[2.5rem] px-[3.75rem]">
        <ArrowLeft size={20} />
      </header>
      <main className="px-[20rem]">
        <p>Informações do carro</p>
        <div className="flex flex-row gap-5">
          <CarImages />

          <div className="bg-white  px-[2.5rem] py-[4rem] w-full drop-shadow-xl">
            <FieldCarInformation field="none" value={'Onix'} />
            <FieldCarInformation field="Marca" value={'Chevorolet'} />
            <FieldCarInformation field="Placa" value={'ADAS-1212'} />

            <p className="mt-5">
              <span className="text-gray-500 text-base">{'sobre'}</span>
              <p className="text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Repudiandae sint nobis molestiae hic exercitationem cum
                temporibus labore odit. A architecto odio quos dolorem
                consequuntur cumque sunt aperiam voluptate, provident autem.
              </p>
            </p>
          </div>
        </div>
        <div>
          Especificações
          <div className="grid grid-cols-3 gap-3 px-[12.5rem]">
            <SpecificationCard field="gasolina" imageUrl={gasolinePng.src} />
            <SpecificationCard field="gasolina" imageUrl={gasolinePng.src} />
            <SpecificationCard field="gasolina" imageUrl={gasolinePng.src} />
            <SpecificationCard field="gasolina" imageUrl={gasolinePng.src} />
            <SpecificationCard field="gasolina" imageUrl={gasolinePng.src} />
            <SpecificationCard field="gasolina" imageUrl={gasolinePng.src} />
          </div>
        </div>
      </main>
    </div>
  )
}

// function add number
