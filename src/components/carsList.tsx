'use client'
import { useState } from 'react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'

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

  fetch(`http://localhost:3000/api/list-car?page=${currentPage}`, {
    method: 'GET',
  }).then((response) => response.json().then((data) => setCars(data.cars)))

  function nextPage() {
    setCurrentPage((state) => state + 1)
  }

  function previousPage() {
    setCurrentPage((state) => state - 1)
  }

  return (
    <div>
      <table className="w-full table-fixed">
        <thead className="w-full">
          <tr className=" bg-gray-300 flex rounded-t-lg w-full justify-between ">
            <th className="p-2 w-40 ">Nome</th>
            <th className="p-2  w-40">Marca</th>
            <th className="p-2 w-40"> Diária</th>
            <th className="p-2 w-40">Placa</th>
            <th className="rounded-tr-lg p-2 w-40">Disponível</th>
          </tr>
        </thead>
        {
          <tbody className="overflow-auto block h-[30rem] bg-white">
            {cars.map((cars) => {
              return (
                <tr
                  key={cars.id}
                  className="border-b-[1px] w-full flex  p-2 justify-between  bg-white"
                >
                  <td className="text-center p-2 w-40">{cars.name}</td>
                  <td className="text-center p-2 w-40">{cars.brand}</td>
                  <td className="text-center p-2 w-40">R$ {cars.daily_rate}</td>
                  <td className="text-center p-2 w-40">{cars.license_plate}</td>
                  <td className="text-center p-2 w-40">sim</td>
                </tr>
              )
            })}
          </tbody>
        }
      </table>
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
      </div>
    </div>
  )
}
