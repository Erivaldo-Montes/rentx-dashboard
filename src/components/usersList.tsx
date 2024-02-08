'use client'
import { use, useEffect, useState } from 'react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { Loading } from './loading'
interface CarsProps {
  id: string
  name: string
  email: string
  driver_license: string
  role: 'USER' | 'ADMIN'
}

export function CarList() {
  const [currentPage, setCurrentPage] = useState(1)
  const [users, setUsers] = useState([] as CarsProps[])
  const [isFetching, setIsFetching] = useState(true)
  const [nextPageUsers, setNextPageUsers] = useState([] as CarsProps[])

  function nextPage() {
    setCurrentPage((state) => state + 1)
  }

  function previousPage() {
    setCurrentPage((state) => state - 1)
  }
  useEffect(() => {
    fetch(`http://localhost:3000/api/list-users?page=${currentPage}`, {
      method: 'GET',
    }).then((response) => response.json().then((data) => setUsers(data.cars)))

    fetch(`http://localhost:3000/api/list-users?page=${currentPage + 1}`, {
      method: 'GET',
    }).then((response) =>
      response.json().then((data) => setNextPageUsers(data.cars)),
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
          {users.map((user) => {
            return (
              <div
                key={user.id}
                className="border-b-[1px] w-full flex  p-2 justify-between  bg-white"
              >
                <div className="text-center p-2 w-40">{user.id}</div>
                <div className="text-center p-2 w-40">{user.name}</div>
                <div className="text-center p-2 w-40">R$ {user.email}</div>
                <div className="text-center p-2 w-40">
                  {user.driver_license}
                </div>
                <div className="text-center p-2 w-40">{user.role}</div>
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

        {nextPageUsers.length === 0 ? null : (
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
