import { useEffect } from 'react'
import { X } from '@phosphor-icons/react'
import { Input } from '@/components/input'
import { SelectCategoryInput } from '@/components/selectCategory'
import { DailyRateInput } from '@/components/dailyRateInput'

interface IUpdateCarInformationModal {
  isOpen: boolean
  onClose: () => void
}

export function UpdateCarInformationModal({
  isOpen,
  onClose,
}: IUpdateCarInformationModal) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
  }, [onClose])
  if (!isOpen) {
    return null
  }

  return (
    <>
      <div
        className="fixed top-0 right-0 left-0 bottom-0 bg-black/40 flex justify-center items-center z-30 transition-opacity duration-100"
        onClick={onClose}
      >
        <div
          className="bg-gray-100 p-4  relative transition-transform duration-100 transform-gpu rounded-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full flex justify-end">
            <button
              onClick={onClose}
              className="bg-red-600 rounded-full p-[1px] flex justify-center items-center "
            >
              <X size={15} fill="white" />
            </button>
          </div>
          <div className="px-[6rem]">
            <h2 className="text-lg">Editar informações do carro</h2>
            <div className="grid grid-cols-2 gap-5 mt-5">
              <div className="flex flex-col">
                <label htmlFor="name">Nome</label>
                <Input name="name" errorMessage={null} />
              </div>
              <div className="flex flex-col">
                <label htmlFor="brand">Marca</label>
                <Input errorMessage={null} name="brand" />
              </div>
              <div className="flex flex-col">
                <label htmlFor="category">Categoria</label>
                <SelectCategoryInput errorMessage={''} name="category" />
              </div>
              <div className="flex flex-col">
                <label htmlFor="">Diaria</label>
                <DailyRateInput
                  change={() => {
                    return null
                  }}
                  errorMessage=""
                />
              </div>
              <div className="flex flex-col col-span-2">
                <label htmlFor="about">sobre</label>
                <textarea className="bg-white resize-none rounded-lg p-2 h-[6rem]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
