'use client'

import { useState } from 'react'
import { ArrowLeft } from '@phosphor-icons/react'
import { CarImages } from '@/components/carImages'
import { FieldCarInformation } from '@/components/fieldCar'
import { SpecificationCard } from '@/components/specificationCard'
import { UpdateCarInformationModal } from '@/components/updateCarInformationModal'

import gasolinePng from '@/assets/energy.png'
import capacityPeoplePng from '@/assets/capacity-people.png'
import accelerationPng from '@/assets/acceleration.png'
import gearboxPng from '@/assets/gearbox.png'
import speedPng from '@/assets/speed.png'
import strengthPng from '@/assets/strenght.png'

export default function CarDetails({ params }: { params: { id: string } }) {
  const [isUpdateCarInformationModalOpen, setIsUpdateCarInformationModalOpen] =
    useState<boolean>(false)

  return (
    <>
      <UpdateCarInformationModal
        onClose={() => {
          setIsUpdateCarInformationModalOpen(false)
        }}
        isOpen={isUpdateCarInformationModalOpen}
      />

      <div className="bg-gray-100  flex-grow">
        <header className="w-full py-[2.5rem] px-[3.75rem]">
          <ArrowLeft size={20} />
        </header>
        <main className="max-md:px-[5rem] px-[10rem] ">
          <span className="text-lg">Informações do carro</span>
          <div className="grid grid-cols-2 gap-5 max-lg:grid-cols-1">
            <CarImages />

            <div className="bg-white  px-[2.5rem] py-[4rem] w-full drop-shadow-xl">
              <button
                onClick={() => setIsUpdateCarInformationModalOpen(true)}
                className="underline text-blue-600"
              >
                editar
              </button>
              <FieldCarInformation field="none" value={'Onix'} />
              <FieldCarInformation field="Marca" value={'Chevorolet'} />
              <FieldCarInformation field="Placa" value={'ADAS-1212'} />
              <FieldCarInformation field="Categoria" value={'SUV'} />

              <div className="mt-5">
                <p className="text-gray-500 text-base">{'sobre'}</p>
                <p className="text-sm ">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Repudiandae sint nobis molestiae hic exercitationem cum
                  temporibus labore odit. A architecto odio quos dolorem
                  consequuntur cumque sunt aperiam voluptate, provident autem.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center mt-[5.625rem]">
            Especificações
            <div className="grid grid-cols-3 gap-3 w-[37rem] max-sm:grid-cols-2 max-sm:w-[25rem]">
              <SpecificationCard
                field="gasolina"
                imageUrl={gasolinePng.src}
                title="consbustível"
              />
              <SpecificationCard
                field="3.2s"
                imageUrl={accelerationPng.src}
                title="0 a 100 km/h"
              />
              <SpecificationCard
                field="800HP"
                imageUrl={strengthPng.src}
                title="força"
              />
              <SpecificationCard
                field="300 km/h"
                imageUrl={speedPng.src}
                title="velocicadade maxíma"
              />
              <SpecificationCard
                field="5 pessoas"
                imageUrl={capacityPeoplePng.src}
                title="acentos"
              />
              <SpecificationCard
                field="Manual"
                imageUrl={gearboxPng.src}
                title="câmbio"
              />
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

// function add number
