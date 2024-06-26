'use client'

import { useEffect, useRef, useState } from 'react'
import { CaretLeft, CaretRight, FolderNotchOpen } from '@phosphor-icons/react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { Loading } from './loading'
import { useList } from '@/hooks/useList'
import { ListType } from '@/utils/types/list'

interface ListProps {
  type: keyof typeof ListType
  columns: string[]
  fieldsOrder: string[]
}

export function List({ type, columns, fieldsOrder }: ListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [items, setItems] = useState<any[]>([])
  const [isFetching, setIsFetching] = useState(true)
  const [nextPageItems, setNextPageItems] = useState([] as any[])
  const textRef = useRef<HTMLDivElement>(null)

  const { getLinkForDetails, fetchItems } = useList()
  const router = useRouter()

  function handleClick(id: string) {
    const link = getLinkForDetails({ id, type })
    router.push(link)
  }

  function nextPage() {
    setCurrentPage((state) => state + 1)
  }

  function previousPage() {
    setCurrentPage((state) => state - 1)
  }

  useEffect(() => {
    async function getCars() {
      try {
        setIsFetching(true)
        const itemsList = await fetchItems(type, currentPage)

        setItems(itemsList)

        const itemsListNextPage = await fetchItems(type, currentPage + 1)

        setNextPageItems(itemsListNextPage)
      } catch (error) {
        toast.error('server error')
      } finally {
        setIsFetching(false)
      }
    }

    getCars()
  }, [])

  useEffect(() => {
    const container = textRef.current

    const handleWheel = (event: WheelEvent) => {
      if (container) {
        container.scrollLeft += event.deltaY
        event.preventDefault()
      }
    }

    if (container) {
      container.addEventListener('wheel', handleWheel)
    }

    return () => {
      container?.removeEventListener('wheel', handleWheel)
    }
  }, [textRef])

  return (
    <>
      <div className="bg-gray-300 flex rounded-t-lg w-full justify-between ">
        {columns.map((colum) => (
          <div key={colum} className="text-center p-2 w-40">
            {colum}
          </div>
        ))}
      </div>
      {isFetching ? (
        <div className="bg-white h-[30rem] flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <div className="overflow-auto  h-[30rem] bg-white">
          {items.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-full w-full">
              <FolderNotchOpen color="#e2e8f0" size={60} />
              <p className="text-gray-400 text-sm">
                Não há carros para listar, crie um carro começar
              </p>
            </div>
          ) : (
            items.map((item) => {
              return (
                <div
                  key={item.id}
                  className="border-b-[1px] w-full flex  p-2 justify-between  bg-white cursor-pointer hover:bg-gray-200"
                  onClick={() => handleClick(item.id)}
                >
                  {fieldsOrder.map((field) => (
                    <div
                      className="text-center p-2 w-40 whitespace-nowrap overflow-x-auto no-scrollbar"
                      ref={textRef}
                      key={field}
                    >
                      {item[field]}
                    </div>
                  ))}
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

        {nextPageItems.length === 0 ? null : (
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
