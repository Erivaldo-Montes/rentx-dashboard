'use client'

import { useState, useEffect } from 'react'
import { useAxiosAuth } from '@/lib/hooks/useAxiosAuth'
import { ArrowLeft } from '@phosphor-icons/react'
import { CarImages } from '@/components/carImages'
import { FieldCarInformation } from '@/components/fieldCar'
import { SpecificationCard } from '@/components/specificationCard'
import { UpdateCarInformationModal } from '@/components/updateCarInformationModal'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { Loading } from '@/components/loading'

interface ICar {
  id: string
  name: string
  brand: string
  about: string
  daily_rate: number
  available: boolean
  license_plate: string
  category_id: string
  images_urls: string[]
  created_at: string
}

type IImages = string

type ISpecifications = {
  id: string
  name: string
  description: string
  created_at: string
  car_id: string
}

export default function CarDetails({ params }: { params: { id: string } }) {
  const [isUpdateCarInformationModalOpen, setIsUpdateCarInformationModalOpen] =
    useState<boolean>(false)

  const [isLoading, setIsLoading] = useState(true)
  const [car, setCar] = useState<ICar>({} as ICar)
  const [specification, setSpecification] = useState<ISpecifications[]>([])
  const [images, setImages] = useState<IImages[]>([])
  const axiosAuth = useAxiosAuth()
  const navigation = useRouter()

  function handleBack() {
    navigation.back()
  }

  useEffect(() => {
    setIsLoading(true)

    async function getCarInformation() {
      try {
        const response = await axiosAuth.get(`/car/${params.id}`)
        console.log('response', response.data)
        setCar(() => {
          return { ...response.data }
        })
        setSpecification(response.data.Specifications)
        setImages(response.data.images_filenames)
      } catch (error) {
        toast.error('Não foi possível obter carro')
      }
    }
    getCarInformation().then()
    setInterval(() => {
      setIsLoading(false)
    }, 700)
  }, [])
  return (
    <>
      <UpdateCarInformationModal
        onClose={() => {
          setIsUpdateCarInformationModalOpen(false)
        }}
        isOpen={isUpdateCarInformationModalOpen}
      />

      <div className="bg-gray-100  flex-grow">
        {isLoading ? (
          <div className="w-screen h-screen flex justify-center items-center">
            <Loading />
          </div>
        ) : (
          <>
            <header className="w-full py-[2.5rem] px-[3.75rem]">
              <ArrowLeft
                size={20}
                onClick={handleBack}
                className="cursor-pointer"
              />
            </header>
            <main className="max-md:px-[5rem] px-[10rem] ">
              <span className="text-lg">Informações do carro</span>
              <div className="grid grid-cols-2 gap-5 mt-20 max-lg:grid-cols-1">
                <CarImages carId={car.id} imageFilenames={images} />

                <div className="bg-white  px-[2.5rem] py-[4rem] w-full drop-shadow-xl">
                  <button
                    onClick={() => setIsUpdateCarInformationModalOpen(true)}
                    className="underline text-blue-600"
                  >
                    editar
                  </button>
                  <FieldCarInformation field="none" value={car.name} />
                  <FieldCarInformation field="Marca" value={car.brand} />
                  <FieldCarInformation
                    field="Placa"
                    value={car.license_plate}
                  />
                  <FieldCarInformation
                    field="Categoria"
                    value={'obter categoria'}
                  />

                  <div className="mt-5">
                    <p className="text-gray-500 text-base">{'sobre'}</p>
                    <p className="text-sm ">{car.about}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center mt-[5.625rem]">
                Especificações
                <div className="grid grid-cols-3 gap-3 w-[37rem] max-sm:grid-cols-2 max-sm:w-[25rem]">
                  {specification.map((item) => {
                    return (
                      <SpecificationCard specification={item} key={item.id} />
                    )
                  })}
                </div>
              </div>
            </main>
          </>
        )}
      </div>
    </>
  )
}
