import { useEffect, useState } from 'react'
import { X } from '@phosphor-icons/react'
import { Input } from '@/components/input'
import { SelectCategoryInput } from '@/components/selectCategory'
import { DailyRateInput } from '@/components/dailyRateInput'
import { Button } from '@/components/button'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ICar } from '@/utils/types/car'

interface IUpdateCarInformationModal {
  isOpen: boolean
  carInformation: ICar
  onClose: () => void
}

const updateCarInformationSchema = z.object({
  name: z.string(),
  brand: z.string(),
  category: z.string(),
  daily_rate: z.string(),
  about: z.string(),
})

type updateCarInformationDataSchema = z.infer<typeof updateCarInformationSchema>

export function UpdateCarInformationModal({
  isOpen,
  onClose,
  carInformation,
}: IUpdateCarInformationModal) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<updateCarInformationDataSchema>({
    resolver: zodResolver(updateCarInformationSchema),
    defaultValues: {
      name: carInformation.name,
      brand: carInformation.brand,
      daily_rate: String(carInformation.daily_rate),
      about: carInformation.about,
    },
  })
  async function handleUpdateCar(data: updateCarInformationDataSchema) {
    console.log(data)
  }

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
          <div className="w-full flex justify-end ">
            <button
              onClick={onClose}
              className="bg-red-600 rounded-full p-[1px] flex justify-center items-center cursor-pointer"
            >
              <X size={15} fill="white" />
            </button>
          </div>
          <div className="px-[6rem] mt-5">
            <h2 className="text-lg">Editar informações do carro</h2>
            <div className="grid grid-cols-2 gap-5 mt-5">
              <div className="flex flex-col">
                <label htmlFor="name">Nome</label>
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Input
                      errorMessage={errors.name?.message}
                      {...field}
                      defaultValue={carInformation.name}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="brand">Marca</label>
                <Controller
                  control={control}
                  name="brand"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      name="brand"
                      errorMessage={errors.brand?.message}
                      defaultValue={carInformation.brand}
                      onChange={onChange}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="category">Categoria</label>
                <Controller
                  control={control}
                  name="category"
                  render={({ field: { value, onChange } }) => (
                    <SelectCategoryInput
                      errorMessage={errors.category?.message}
                      name="category"
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="">Diária</label>
                <Controller
                  control={control}
                  name="daily_rate"
                  render={({ field: { onChange } }) => (
                    <DailyRateInput
                      change={onChange}
                      defaultValue={carInformation.daily_rate}
                      errorMessage={errors.daily_rate?.message}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col col-span-2">
                <label htmlFor="about">Sobre</label>
                <textarea
                  className="bg-white resize-none rounded-lg p-2 h-[6rem] outline-gray-300"
                  defaultValue={carInformation.about}
                />
              </div>
            </div>
            <div className="w-full flex flex-row justify-center items-center gap-5 mt-10">
              <Button
                text="Atualizar"
                onClick={handleSubmit(handleUpdateCar)}
              />
              <Button text="Cancelar" buttonStyle="RED" onClick={onClose} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}