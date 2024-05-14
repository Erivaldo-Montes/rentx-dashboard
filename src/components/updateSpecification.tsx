import { Button } from '@/components/button'
import { X } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { Input } from '@/components/input'
import { ISpecifications } from '@/@types/specification'
import { useAxiosAuth } from '@/lib/hooks/useAxiosAuth'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

interface IUpdateSpecificationProps {
  onClose: () => void
  specification: ISpecifications
  isOpen: boolean
}

const updateSpecificationSchema = z.object({
  specificationToUpdate: z.coerce.number().gt(1, 'Insira os dados'),
})

type UpdateSpecificationDataSchema = z.infer<typeof updateSpecificationSchema>

const updateSpecificationQuestion = {
  gearbox: {
    question: 'Selecione um mode de câmbio',
    select: [
      { value: 'manual', text: 'manual' },
      { value: 'automatic', text: 'automático' },
    ],
  },
  acceleration: {
    question: 'Define o tempo de aceleração',
    select: [],
  },
  people: {
    question: 'Define o capacidade pessoas no carro',
    select: [],
  },
  fuel: {
    question: 'Selecione o tipo de combústivel',
    select: [
      {
        value: 'eletric',
        text: 'elétrico',
      },
      {
        value: 'gasoline',
        text: 'gasolina',
      },
      {
        value: 'diesel',
        text: 'disel',
      },
    ],
  },
  power: {
    question: 'Define a força do motor em HP(cavalos):',
    select: [],
  },
  speed: {
    question: 'Define a velocicade maxíma',
    select: [],
  },
}
export function UpdateSpecification({
  onClose,
  specification,
  isOpen,
}: IUpdateSpecificationProps) {
  const measurementUnits = ['km/h', 's', 'HP']
  const regex = new RegExp(measurementUnits.join('|'), 'g')
  const specificationNamesWithoutMeasurementUnits =
    specification.description.replace(regex, '')
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = useForm<UpdateSpecificationDataSchema>({
    resolver: zodResolver(updateSpecificationSchema),
    defaultValues: {
      specificationToUpdate: Number(specificationNamesWithoutMeasurementUnits),
    },
  })

  const axiosAuth = useAxiosAuth()

  function formatSpecification(
    name: ISpecifications['name'],
    value: string,
  ): Record<string, any> {
    switch (name) {
      case 'acceleration':
        return {
          [name]: value.concat(' s'),
        }
      case 'power':
        return {
          [name]: value.concat(' HP'),
        }
      case 'speed':
        return {
          [name]: value.concat(' km/h'),
        }
      default:
        return { [name]: value }
    }
  }

  async function handleUpdateSpecification(
    data: UpdateSpecificationDataSchema,
  ) {
    await axiosAuth.patch(`/car/specification/${specification.car_id}`, {
      name: specification.name,
      description: formatSpecification(
        specification.name,
        String(data.specificationToUpdate),
      )[specification.name],
    })

    window.location.reload()
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
          className="bg-gray-100 p-4  relative transition-transform duration-100 transform-gpu rounded-lg flex justify-center items-center flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full flex justify-end items-end">
            <button
              className="bg-red-600 rounded-full p-1 cursor-pointer"
              onClick={onClose}
            >
              <X size={15} fill="#ffffff" />
            </button>
          </div>
          <div className="mt-5 ">
            {updateSpecificationQuestion[specification.name].question}
          </div>
          {specification.name === 'fuel' || specification.name === 'gearbox' ? (
            <Controller
              control={control}
              name="specificationToUpdate"
              render={({ field: { onBlur, onChange } }) => (
                <select
                  defaultValue={specification.description}
                  className="mt-5 bg-white w-full p-2 rounded-lg outline-gray-300 "
                  onChange={onChange}
                  onBlur={onBlur}
                >
                  {updateSpecificationQuestion[specification.name].select.map(
                    (item) => (
                      <option value={item.value} key={item.text}>
                        {item.text}
                      </option>
                    ),
                  )}
                </select>
              )}
            />
          ) : (
            <Controller
              control={control}
              name="specificationToUpdate"
              render={({ field: { onBlur, onChange, value } }) => (
                <div className="mt-5">
                  <Input
                    errorMessage={errors.specificationToUpdate}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                  {errors.specificationToUpdate && (
                    <div className="text-red-600 text-sm">
                      {errors.specificationToUpdate.message}
                    </div>
                  )}
                </div>
              )}
            />
          )}
          <div className="flex flex-row gap-2 mt-5">
            <Button
              text="Atualizar"
              buttonStyle="GREEN"
              isSubmitting={isSubmitting}
              onClick={handleSubmit(handleUpdateSpecification)}
            />
            <Button text="Cancelar" buttonStyle="RED" onClick={onClose} />
          </div>
        </div>
      </div>
    </>
  )
}
