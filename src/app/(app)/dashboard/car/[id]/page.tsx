'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/axios'
import { ArrowLeft } from '@phosphor-icons/react'
import { CarImages } from '@/components/carImages'
import { FieldCarInformation } from '@/components/fieldCar'
import { SpecificationCard } from '@/components/specificationCard'
import { UpdateCarInformationModal } from '@/components/updateCarInformationModal'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { Loading } from '@/components/loading'
import { ISpecifications } from '@/utils/types/specification'
import { ICar } from '@/utils/types/car'
import { ICategory } from '@/utils/types/category'
import { formatToCurrency } from '@/utils/formatToCurrency'
import { ConfirmationDialog } from '@/components/confirmationDialog'

type IImages = string

export default function CarDetails({ params }: { params: { id: string } }) {
  const [isUpdateCarInformationModalOpen, setIsUpdateCarInformationModalOpen] =
    useState<boolean>(false)

  const [isLoading, setIsLoading] = useState(true)
  const [car, setCar] = useState<ICar>({} as ICar)
  const [category, setCategory] = useState<ICategory>({} as ICategory)
  const [specification, setSpecification] = useState<ISpecifications[]>([])
  const [images, setImages] = useState<IImages[]>([])
  const [deletingCar, setDeletingCar] = useState(false)

  const navigation = useRouter()

  const orderedSpecification = [...specification].sort((a, b) => {
    if (a.name < b.name) return -1
    if (a.name > b.name) return 1
    return 0
  })

  function handleBack() {
    navigation.back()
  }

  async function handleDeleteCar() {
    try {
      await api.delete(`/car/${car.id}`)
      toast.success('carro removido com sucesso')

      navigation.replace('/dashboard/cars')
    } catch (error) {
      toast.error('Não é possivel remover o carro')
      console.error(error)
    }
  }

  useEffect(() => {
    setIsLoading(true)

    async function getCarInformation() {
      try {
        const carResponse = await api.get(`/car/${params.id}`)
        setCar(() => {
          return { ...carResponse.data }
        })
        setSpecification(carResponse.data.Specifications)
        setImages(carResponse.data.images_filenames)

        const categoryResponse = await api.get(
          `/category/${carResponse.data.category_id}`,
        )

        setCategory(categoryResponse.data)
      } catch (error) {
        toast.error('Não foi possível obter carro')
      }
    }
    getCarInformation().then()
    setInterval(() => {
      setIsLoading(false)
    }, 700)
  }, [params.id])
  return (
    <>
      <ConfirmationDialog
        isOpen={deletingCar}
        onClose={() => setDeletingCar(false)}
        title="Deseje mesmo deletar o carro? (Ação não é reversível)"
        actionFunction={handleDeleteCar}
      />
      <UpdateCarInformationModal
        onClose={() => {
          setIsUpdateCarInformationModalOpen(false)
        }}
        isOpen={isUpdateCarInformationModalOpen}
        carInformation={car}
      />

      <div className="bg-gray-100">
        {isLoading ? (
          <div className="w-screen h-screen flex justify-center items-center">
            <Loading />
          </div>
        ) : (
          <>
            <header className="w-full py-[2.5rem] px-[3.75rem] max-md:px-[1rem] ">
              <ArrowLeft
                size={20}
                onClick={handleBack}
                className="cursor-pointer hover:bg-gray-200 rounded-full transition-colors "
              />
            </header>
            <main className="max-md:px-[1rem] px-[10rem] pb-10 ">
              <span className="text-lg">Informações do carro</span>
              <div className="grid grid-cols-2 gap-5 mt-20 max-lg:grid-cols-1">
                <CarImages carId={car.id} imageFilenames={images} />

                <div className="bg-white  px-[2.5rem] py-[4rem] w-full drop-shadow-xl ">
                  <FieldCarInformation field="nome" value={car.name} />
                  <FieldCarInformation field="Marca" value={car.brand} />
                  <FieldCarInformation
                    field="Diária"
                    value={formatToCurrency(car.daily_rate / 100)}
                  />
                  <FieldCarInformation
                    field="Placa"
                    value={car.license_plate}
                  />
                  <FieldCarInformation
                    field="Categoria"
                    value={category.name}
                  />
                  <div className="mt-10 w-full flex justify-center items-center gap-5">
                    <button
                      onClick={() => setIsUpdateCarInformationModalOpen(true)}
                      className="bg-blue-600 p-2 text-white rounded-lg drop-shadow-lg cursor-pointer hover:bg-blue-700"
                    >
                      Atualizar carro
                    </button>
                    <button
                      onClick={() => setDeletingCar(true)}
                      className="bg-red-600 p-2 text-white rounded-lg drop-shadow-lg cursor-pointer hover:bg-red-700"
                    >
                      Deletar carro
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-20 ">
                <p className=" text-2xl w-full text-center">{'Sobre'}</p>
                <div className="mt-5 text-gray-700">{car.about}</div>
              </div>
              <div className="flex flex-col items-center mt-[5.625rem]">
                <p className="text-2xl">Especificações</p>
                <div className="grid grid-cols-3 gap-3 w-[37rem] max-sm:grid-cols-2 max-sm:w-[25rem] mt-10">
                  {orderedSpecification.map((item) => {
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
