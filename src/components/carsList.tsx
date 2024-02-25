'use client'
import { useEffect, useState } from 'react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { Loading } from './loading'
import { toast } from 'react-toastify'

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

  useEffect(() => {
    setIsFetching(true)

    fetch(`api/list-car?page=${currentPage}`, {
      method: 'GET',
    })
      .then((response) => response.json().then((data) => setCars(data.cars)))
      .catch(() => toast.error('server error'))

    fetch(`api/list-car?page=${currentPage + 1}`, {
      method: 'GET',
    }).then((response) =>
      response.json().then((data) => setNextPageCars(data.cars)),
    )

    setIsFetching(false)
  }, [currentPage])

  return (
    <>
      {isFetching ? (
        <div className="bg-white h-[30rem] flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <div className="overflow-auto  h-[30rem] bg-white">
          {cars.map((cars) => {
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
                <div className="text-center p-2 w-40">{cars.license_plate}</div>
                <div className="text-center p-2 w-40">sim</div>
              </div>
            )
          })}
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
