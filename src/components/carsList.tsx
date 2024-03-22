'use client'
import { useEffect, useState } from 'react'
import { CaretLeft, CaretRight, FolderNotchOpen } from '@phosphor-icons/react'
import { toast } from 'react-toastify'
import { axiosAuth } from '@/lib/axios'
interface CarsProps {
  id: string
  name: string
  brand: string
  daily_rate: number
  license_plate: string
}

export function CarList() {
  const [currentPage, setCurrentPage] = useState(1)
  const [cars, setCars] = useState([] as CarsProps[])
  const [isFetching, setIsFetching] = useState(true)
  const [nextPageCars, setNextPageCars] = useState([] as CarsProps[])

  function nextPage() {
    setCurrentPage((state) => state + 1)
  }

  function previousPage() {
    setCurrentPage((state) => state - 1)
  }

  async function getCars() {
    try {
      setIsFetching(true)
      const carsList = await axiosAuth.get(`/car/list?page=${currentPage}`)

      setCars(carsList.data.cars)

      const carsListNextPage = await axiosAuth.get(
        `/car/list?page=${currentPage + 1}`,
      )

      setNextPageCars(carsListNextPage.data.cars)
    } catch (error) {
      toast.error('server error')
    } finally {
      setIsFetching(false)
      console.log(cars)
    }
  }

  useEffect(() => {
    getCars()
  }, [])

  return (
    <>
      {isFetching ? (
        <div className="bg-white h-[30rem] flex justify-center items-center">
          <CarLoading />
        </div>
      ) : (
        <div className="overflow-auto  h-[30rem] bg-white">
          {cars.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-full w-full">
              <FolderNotchOpen color="#e2e8f0" size={60} />
              <p className="text-gray-400 text-sm">
                Não há carros para listar, crie um carro começar
              </p>
            </div>
          ) : (
            cars.map((cars) => {
              return (
                <div
                  key={cars.id}
                  className="border-b-[1px] w-full flex  p-2 justify-between  bg-white"
                >
                  <div className="text-center p-2 w-40">{cars.name}</div>
                  <div className="text-center p-2 w-40">{cars.brand}</div>
                  <div className="text-center p-2 w-40">
                    R$ {cars.daily_rate / 100}
                  </div>
                  <div className="text-center p-2 w-40">
                    {cars.license_plate}
                  </div>
                  <div className="text-center p-2 w-40">sim</div>
                </div>
              )
            })
          )}
        </div>
      )}

      <div className="flex flex-row gap-2 items-center mt-4 justify-center">
        <CaretLeft
          fill="#000000"
          width={20}
          height={20}
          onClick={previousPage}
          className="hover:cursor-pointer"
        />

        {currentPage - 1 !== 0 && (
          <p
            className="text-black text-center text-xs hover:cursor-pointer"
            onClick={previousPage}
          >
            {currentPage - 1}
          </p>
        )}

        <div className="bg-blue-600  flex rounded-full w-[1.25rem] h-[1.25rem] justify-center items-center">
          <p className="text-white text-center text-xs">{currentPage}</p>
        </div>

        {nextPageCars.length === 0 ? null : (
          <>
            <p
              className="text-black text-center text-xs hover:cursor-pointer"
              onClick={nextPage}
            >
              {currentPage + 1}
            </p>

            <CaretRight
              className="hover:cursor-pointer"
              fill="#000000"
              width={20}
              height={20}
              onClick={nextPage}
            />
          </>
        )}
      </div>
    </>
  )
}

function CarLoading() {
  return (
    <div
      className={`w-6 h-6 rounded-full animate-spin border-2 border-solid border-indigo-600 border-t-transparent`}
    ></div>
  )
}
