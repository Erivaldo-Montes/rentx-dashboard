import { Button } from '@/components/button'
import { X } from '@phosphor-icons/react'
import { useEffect } from 'react'
import { Input } from '@/components/input'
import { ISpecifications } from '@/utils/types/specification'
import { api } from '@/lib/axios'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { specificationSelectOptions } from '@/utils/constants/selectOptions'
import { addMeasurementUnits } from '@/utils/formatSpecification'
import { FormErrorMessage } from './formErrorMessage'

interface IUpdateSpecificationProps {
  onClose: () => void
  specification: ISpecifications
  isOpen: boolean
}

const updateSpecificationSchema = z.object({
  specificationToUpdate: z.string().min(1, 'Insira os dados'),
})

type UpdateSpecificationDataSchema = z.infer<typeof updateSpecificationSchema>

const updateSpecificationQuestion = {
  gearbox: {
    question: 'Selecione um mode de câmbio',
  },
  acceleration: {
    question: 'Define o tempo de aceleração',
  },
  people: {
    question: 'Define o capacidade pessoas no carro',
  },
  fuel: {
    question: 'Selecione o tipo de combústivel',
  },
  power: {
    question: 'Define a força do motor em HP(cavalos):',
  },
  speed: {
    question: 'Define a velocicade maxíma',
  },
}
export function UpdateSpecification({
  onClose,
  specification,
  isOpen,
}: IUpdateSpecificationProps) {
  const measurementUnits = ['km/h', ' s', 'HP']
  const regex = new RegExp(measurementUnits.join('|'), 'g')
  const specificationNamesWithoutMeasurementUnits =
    specification.description.replace(regex, '')

  const {
    handleSubmit,
    control,
    register,
    formState: { isSubmitting, errors },
  } = useForm<UpdateSpecificationDataSchema>({
    resolver: zodResolver(updateSpecificationSchema),
    defaultValues: {
      specificationToUpdate: String(specificationNamesWithoutMeasurementUnits),
    },
  })

  async function handleUpdateSpecification(
    data: UpdateSpecificationDataSchema,
  ) {
    await api.patch(`/car/specification/${specification.id}`, {
      name: specification.name,
      description: addMeasurementUnits({
        name: specification.name,
        description: String(data.specificationToUpdate),
      })[specification.name],
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
          <form
            action=""
            onSubmit={handleSubmit(handleUpdateSpecification)}
            className="flex flex-col justify-center items-center"
          >
            {specification.name === 'fuel' ||
            specification.name === 'gearbox' ? (
              <select
                defaultValue={specification.description}
                className={`bg-white w-full p-2 rounded-lg outline-gray-300 ${errors.specificationToUpdate && 'border-red-600 border-2 outline-red-600'}`}
                {...register('specificationToUpdate')}
              >
                {specificationSelectOptions[specification.name].options.map(
                  (item) => (
                    <option value={item.value} key={item.text}>
                      {item.text}
                    </option>
                  ),
                )}
              </select>
            ) : (
              <Controller
                control={control}
                name="specificationToUpdate"
                render={({ field: { onBlur, onChange, value } }) => (
                  <div className="mt-5">
                    <Input
                      type="number"
                      errorMessage={errors.specificationToUpdate}
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                    />
                    <FormErrorMessage
                      isShow={!!errors.specificationToUpdate}
                      message={errors.specificationToUpdate?.message}
                    />
                  </div>
                )}
              />
            )}
            <div className="flex flex-row gap-2 mt-5">
              <Button
                text="Atualizar"
                buttonStyle="GREEN"
                isSubmitting={isSubmitting}
                disabled={isSubmitting}
                type="submit"
              />
              <Button text="Cancelar" buttonStyle="RED" onClick={onClose} />
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
