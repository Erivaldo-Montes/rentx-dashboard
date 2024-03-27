'use client'

import { useRouter } from 'next/navigation'
import { PhotoSvg } from '@/components/icons/photo'
import { ArrowLeft, Plus, Trash } from '@phosphor-icons/react/dist/ssr'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, ChangeEvent, useEffect, useRef } from 'react'
import { Input } from '@/components/input'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { v4 as uuidV4 } from 'uuid'
import { Loading } from '@/components/loading'
import { AppError } from '@/utils/appError'
import { toast } from 'react-toastify'
import { useAxiosAuth } from '@/lib/hooks/useAxiosAuth'

type Category = {
  id: string
  name: string
  description: string
  create_at: string
}

const carSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  brand: z.string().min(1, 'Marca é obrigatório'),
  daily_rate: z.string().min(1, 'Diária é obrigatória'),
  license_plate: z.string().min(1, 'Placa é obrigatório'),
  about: z.string(),
  speed: z.coerce.number().gt(1, 'Velecidade é obrigatório'),
  people: z.string().min(1, 'Números de pessoas é obrigatório'),
  gearbox: z.enum(['manual', 'auto']),
  aceleration: z.coerce.number().min(1, 'Aceleração é obrigatório'),
  power: z.string().min(1, 'Força é obrigatório'),
  fuel: z.enum(['gasoline', 'disel', 'eletric']),
  category: z.string().min(1, 'Obrigatório'),
})

type CreateCarDataSchema = z.infer<typeof carSchema>

type SpecificationsSchema = Pick<
  CreateCarDataSchema,
  'people' | 'gearbox' | 'aceleration' | 'power' | 'fuel' | 'speed'
>

export default function CreateCar() {
  const axiosAuth = useAxiosAuth()
  const [files, setFiles] = useState<any[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { getRootProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    onDrop: (acceptedFiles) => {
      setFiles((state) => {
        const files = acceptedFiles.map((file) =>
          Object.assign(file, {
            id: uuidV4(),
            preview: URL.createObjectURL(file),
          }),
        )

        const concatArrays = files.concat(state)

        return concatArrays
      })
    },
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = useForm<CreateCarDataSchema>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      about: '',
      brand: '',
      license_plate: '',
      daily_rate: '',
      name: '',
      aceleration: 0,
      people: '',
      power: '',
      speed: 0,
    },
  })

  async function handleCreateCar(data: CreateCarDataSchema) {
    const value = data.daily_rate.match(/\d+/g)

    if (value) {
      const valueString = value.join('')
      data.daily_rate = valueString
      try {
        const responseCar = await axiosAuth.post('/car', {
          name: data.name,
          brand: data.brand,
          about: data.about,
          daily_rate: Number(data.daily_rate),
          license_plate: data.license_plate,
          category_id: data.category,
        })

        const specifications: (keyof SpecificationsSchema)[] = [
          'aceleration',
          'fuel',
          'gearbox',
          'people',
          'power',
          'speed',
        ]

        specifications.forEach((specification) => {
          axiosAuth.patch(`/car/specification/${responseCar.data.id}`, {
            name: specification,
            description: String(data[specification]),
          })
        })
      } catch (error) {
        const isAppError = error instanceof AppError
        const title = isAppError ? error.message : 'Não foi possivel criar'
        toast.error(title)
      }
    }
  }

  function handleBack() {
    router.back()
  }

  function handleRemoveImages(id: string) {
    const NewArrayFiles = files.filter((item) => item.id !== id)
    setFiles(NewArrayFiles)
  }

  useEffect(() => {
    if (files.length < 3) {
      return
    }
    const container = containerRef.current

    const handleWheel = (event: WheelEvent) => {
      if (container) {
        container.scrollLeft += event.deltaY
        event.preventDefault()
      }
    }

    // remove listenres
    if (container) {
      container.addEventListener('wheel', handleWheel)

      return () => {
        container.removeEventListener('wheel', handleWheel)
      }
    }
  }, [files])

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div
        className="w-full px-10 py-4 cursor-pointer"
        onClick={handleBack}
        title="voltar"
      >
        <ArrowLeft />
      </div>
      <div className="px-[5rem] mt-10 md:px-[10rem] xl:px-[20rem] max-sm:px-[1rem] bg-gray-100">
        <div className="w-full flex justify-start">
          <p className="text-lg font-medium">Criar novo carro</p>
        </div>
        <form
          action=""
          className="grid grid-cols-4 gap-x-[2rem] gap-y-[2.5rem] mt-10 max-sm:flex max-sm:flex-col "
        >
          <div className="flex flex-col gap-2 col-span-2">
            <label htmlFor="name" className="text-sm">
              Nome
            </label>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  errorMessage={errors.name}
                  onChange={onChange}
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
                  errorMessage={errors.brand}
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

            <Controller
              control={control}
              name="category"
              render={({ field: { onBlur, onChange } }) => (
                <CategorySelectInput
                  errorMessage={errors.category?.message}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />

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
              render={({ field: { onChange, value, onBlur } }) => (
                <DailyRateInput
                  change={onChange}
                  onBlur={onBlur}
                  errorMessage={errors.daily_rate?.message}
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
            <label htmlFor="license_plate" className="text-sm">
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

          <div className="flex flex-col gap-2 col-span-2 ">
            <label htmlFor="gearbox">Câmbio</label>

            <select
              {...register('gearbox')}
              className={`bg-white w-full p-2 rounded-lg outline-gray-300 ${errors.gearbox && 'border-red-600 border-2 outline-red-600'}`}
            >
              <option value="selecione">selecione</option>
              <option value="manual">Manual</option>
              <option value="auto">Automático</option>
            </select>
            {errors.gearbox && (
              <span className="text-red-600 text-sm">
                Selecione um tipo de Câmbio
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 col-span-1 ">
            <label htmlFor="speed">Velocidade Max. (km/h)</label>

            <Controller
              control={control}
              name="speed"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  errorMessage={errors.speed}
                  type="number"
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />

            {errors.speed && (
              <span className="text-red-600 text-sm">
                {errors.speed.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 col-span-1 ">
            <label htmlFor="people">Números de pessoas</label>
            <Controller
              control={control}
              name="people"
              render={({ field: { onChange, onBlur } }) => (
                <Input
                  type="number"
                  errorMessage={errors.people}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />

            {errors.people && (
              <span className="text-red-600 text-sm">
                {errors.people.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 col-span-2 ">
            <label htmlFor="aceleration">
              Tempo de aceleração (0 a 100) em segundos
            </label>
            <Controller
              control={control}
              name="aceleration"
              render={({ field: { onChange, onBlur } }) => (
                <Input
                  type="number"
                  errorMessage={errors.aceleration}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />

            {errors.aceleration && (
              <span className="text-red-600 text-sm">
                {errors.aceleration.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 col-span-1 ">
            <label htmlFor="fuel">Combustível</label>
            <select
              {...register('fuel')}
              className={`bg-white w-full p-2 rounded-lg outline-gray-300 ${errors.gearbox && 'border-red-600 border-2 outline-red-600'}`}
            >
              <option value="selecione">selecione</option>
              <option value="gasoline">Gasolina</option>
              <option value="diesel">diesel</option>
              <option value="eletric">Elétrico</option>
            </select>

            {errors.fuel && (
              <span className="text-red-600 text-sm">
                selecione o tipo de combustível
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 col-span-1">
            <label htmlFor="power">Forca (HP)</label>
            <Controller
              control={control}
              name="power"
              render={({ field: { onChange, onBlur } }) => (
                <Input
                  type="number"
                  errorMessage={errors.power}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />

            {errors.power && (
              <span className="text-red-600 text-sm">
                {errors.power.message}
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
          <div
            className="list-images flex  w-full gap-5 mt-10 overflow-x-auto"
            ref={containerRef}
          >
            <div
              className="flex justify-center items-center relative"
              title="Adicionar foto"
              {...getRootProps()}
            >
              <PhotoSvg width={200} height={200} />

              <div className="p-2 bg-blue-600 rounded-full absolute">
                <Plus width={40} height={40} color="white" />
              </div>
            </div>
            {files.map((file) => {
              return (
                <div
                  className="flex justify-center items-center  w-[200px] h-[200px] relative"
                  key={file.id}
                >
                  <Image
                    src={file.preview}
                    height={200}
                    width={200}
                    alt="car image"
                    draggable={false}
                    className="min-h-[200px] min-w-[200px] object-cover"
                  />
                  <div
                    className="absolute bottom-1 right-1 bg-red-600 p-3 rounded-lg"
                    onClick={() => handleRemoveImages(file.id)}
                    title="remover imagem"
                  >
                    <Trash width={20} height={20} color="white" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="w-full flex justify-center mt-10">
          <button
            type="submit"
            className=" flex rounded-lg bg-green-600 w-[7rem] py-2 justify-center text-white mb-10"
            onClick={handleSubmit(handleCreateCar)}
          >
            {isSubmitting ? (
              <Loading />
            ) : (
              <p className="text-md text-center">Criar</p>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

interface CategorySelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  errorMessage: string | undefined
}
function CategorySelectInput({ errorMessage, ...rest }: CategorySelectProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const axiosAuth = useAxiosAuth()
  async function getCategories() {
    try {
      const response = await axiosAuth.get(`/category`)

      const data = response.data

      setCategories(data.categories)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getCategories()
  }, [])
  return (
    <select
      defaultValue={''}
      {...rest}
      className={`bg-white w-full p-2 rounded-lg outline-gray-300 ${errorMessage && 'border-red-600 border-2 outline-red-600'}`}
    >
      <option value={''}>Selecione</option>
      {categories.map((item) => {
        return (
          <option value={item.id} key={item.id}>
            {item.name}
          </option>
        )
      })}
    </select>
  )
}

interface DailyRateProps extends React.InputHTMLAttributes<HTMLInputElement> {
  change: (e: ChangeEvent) => void
  errorMessage: string | undefined
}

function DailyRateInput({
  change,
  errorMessage,

  ...rest
}: DailyRateProps) {
  const [daily, setDaily] = useState<string>('')
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target
    const formatedValue = formatToCurrency(value)
    setDaily(formatedValue)
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

  return (
    <Input
      errorMessage={errorMessage}
      value={daily}
      {...rest}
      onChange={(e) => {
        change(e)
        handleChange(e)
      }}
    />
  )
}
