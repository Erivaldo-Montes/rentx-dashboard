'use client'
import { PhotoSvg } from '@/components/icons/photo'
import { ArrowLeft, Plus } from '@phosphor-icons/react/dist/ssr'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, ChangeEvent, useEffect } from 'react'
import { Input } from '@/components/input'

enum CategoriesEnum {
  SUV = 'SUV',
  sedan = 'sedan',
  espotivo = 'esportivo',
}

const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  brand: z.string().min(1, 'Marca é obrigatório'),
  daily_rate: z.string().min(1, 'Diária é obrigatória'),
  license_plate: z.string().min(1, 'Placa é obrigatório'),
  about: z.string().min(1),
  category: z.nativeEnum(CategoriesEnum),
})

type CreateCarDataSchema = z.infer<typeof schema>

export default function CreateCar() {
  const [daily, setDaily] = useState<string>('')

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateCarDataSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      about: '',
      brand: '',
      license_plate: '',
      daily_rate: '',
      name: '',
    },
  })
  const selectCategory = watch('category')

  function handleCreateCar(data: CreateCarDataSchema) {
    const value = data.daily_rate.match(/\d+/g)

    if (value) {
      const valueString = value.join('')
      const valueFormatedInCurrency = parseInt(valueString, 10)

      console.log(data, valueFormatedInCurrency / 100)
    }
  }

  function formatToCurrency(input: string) {
    // Remove qualquer caractere que não seja um dígito numérico
    let formatedValue = input.replace(/\D/g, '')

    // Formata o número para o formato monetário (com duas casas decimais e separador de milhares)
    formatedValue = (Number(formatedValue) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })

    return formatedValue
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target
    const formatedValue = formatToCurrency(value)
    setDaily(formatedValue)
  }

  useEffect(() => {
    setValue('daily_rate', daily)
  }, [daily, setValue])

  return (
    <div className="flex flex-col pb-10 bg-gray-100">
      <div className="w-full px-10 py-4">
        <ArrowLeft />
      </div>
      <div className="px-[20rem] mt-10 ">
        <div className="w-full flex justify-start">
          <p>Criar novo carro</p>
        </div>
        <form
          action=""
          className="grid grid-cols-4 gap-x-[2rem] gap-y-[2.5rem] mt-10"
        >
          <div className="flex flex-col gap-2 col-span-2">
            <label htmlFor="name" className="text-sm">
              Nome
            </label>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  errorMessage={errors.name}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />

            {errors.name && (
              <span className="text-red-600 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 col-span-2">
            <label htmlFor="name" className="text-sm">
              Marca
            </label>
            <Controller
              control={control}
              name="brand"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  errorMessage={errors.name}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />
            {errors.brand && (
              <span className="text-red-600 text-sm">
                {errors.brand.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 col-span-1 ">
            <p className="text-sm">Categoria</p>
            <select
              className={`bg-white w-full p-2 rounded-lg outline-gray-300 ${errors.category && 'border-red-600 border-2 outline-red-600'}`}
              {...register('category')}
            >
              <option>Selecione</option>
              <option
                selected={selectCategory === CategoriesEnum.SUV}
                value="SUV"
              >
                SUV
              </option>
              <option
                selected={selectCategory === CategoriesEnum.sedan}
                value="sedan"
              >
                sedan
              </option>
              <option
                selected={selectCategory === CategoriesEnum.espotivo}
                value="esportivo"
              >
                esportivo
              </option>
            </select>

            {errors.category && (
              <span className="text-red-600 text-sm">
                Selecione uma categoria
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 col-span-1 ">
            <label htmlFor="daily_rate" className="text-sm">
              Diária
            </label>

            <Controller
              control={control}
              name="daily_rate"
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value}
                  errorMessage={errors.daily_rate}
                  onChange={(e) => {
                    handleChange(e)
                    onChange(e)
                  }}
                />
              )}
            />

            {errors.daily_rate && (
              <span className="text-red-600 text-sm">
                {errors.daily_rate.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 col-span-2 ">
            <label htmlFor="daily_rate" className="text-sm">
              Placa do carro
            </label>
            <Controller
              control={control}
              name="license_plate"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  onBlur={onBlur}
                  value={value}
                  errorMessage={errors.license_plate}
                  onChange={onChange}
                />
              )}
            />

            {errors.license_plate && (
              <span className="text-red-600 text-sm">
                {errors.license_plate.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 col-span-4">
            <label htmlFor="about" className="text-sm">
              sobre
            </label>
            <textarea
              className="rounded-lg p-2 h-[6.25rem] outline-gray-300 resize-none"
              {...register('about')}
            />
            {errors.about && (
              <span className="text-red-600 text-sm">
                {errors.about.message}
              </span>
            )}
          </div>
        </form>

        <div className="mt-10">
          <p className="">upload de imagems</p>
          <div className="flex">
            <div className="flex justify-center items-center">
              <PhotoSvg width={200} height={200} />
              <div className="p-2 bg-blue-600 rounded-full absolute">
                <Plus width={40} height={40} color="white" />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center mt-10">
          <button
            className="rounded-lg bg-green-600 px-10 py-2 text-white"
            onClick={handleSubmit(handleCreateCar)}
          >
            Criar
          </button>
        </div>
      </div>
    </div>
  )
}
