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

enum CategoriesEnum {
  SUV = 'SUV',
  sedan = 'sedan',
  espotivo = 'esportivo',
}

type Category = {
  id: string
  name: string
  description: string
  create_at: string
}

const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  brand: z.string().min(1, 'Marca é obrigatório'),
  daily_rate: z.string().min(1, 'Diária é obrigatória'),
  license_plate: z.string().min(1, 'Placa é obrigatório'),
  about: z.string(),
})

type CreateCarDataSchema = z.infer<typeof schema>

export default function CreateCar() {
  const [daily, setDaily] = useState<string>('')
  const [files, setFiles] = useState<any[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPending, setIsPending] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category>()
  const [categoryError, setCategoryError] = useState(false)

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

  async function handleCreateCar(data: CreateCarDataSchema) {
    setIsPending(true)
    const value = data.daily_rate.match(/\d+/g)

    console.log(selectedCategory)

    // validate category
    if (!selectedCategory) {
      setCategoryError(true)
      setIsPending(false)
      return
    } else {
      setCategoryError(false)
    }

    await new Promise((resolve) => setTimeout(resolve, 3000))

    if (value) {
      const valueString = value.join('')
      data.daily_rate = valueString

      await fetch('/api/car/create', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          brand: data.brand,
          daily_rate: Number(valueString),
          license_plate: data.license_plate,
          category_id: selectedCategory?.id,
        }),
      })
    }

    setIsPending(false)
  }

  function handleBack() {
    router.back()
  }

  function handleSelectedChange(event: ChangeEvent) {
    const value = event.target.value
    const categoryChange = categories.find((item) => item.name === value)
    console.log(categoryChange)
    setSelectedCategory(categoryChange)
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

  function handleRemoveImages(id: string) {
    const NewArrayFiles = files.filter((item) => item.id !== id)
    setFiles(NewArrayFiles)
  }

  async function getCategories() {
    try {
      const response = await fetch(`/api/car/categories`, { method: 'GET' })

      const data = await response.json()

      setCategories(data.categories)
    } catch (error) {
      console.log(error)
    }
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

    if (container) {
      container.addEventListener('wheel', handleWheel)

      return () => {
        container.removeEventListener('wheel', handleWheel)
      }
    }
  }, [files])

  useEffect(() => {
    setValue('daily_rate', daily)
  }, [daily, setValue])

  useEffect(() => {
    getCategories()
  }, [])

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
              onChange={handleSelectedChange}
              defaultValue={''}
              className={`bg-white w-full p-2 rounded-lg outline-gray-300 ${categoryError && 'border-red-600 border-2 outline-red-600'}`}
            >
              <option value={'selecione'}>Selecione</option>
              {categories.map((item) => {
                return (
                  <option value={item.name} key={item.id}>
                    {item.name}
                  </option>
                )
              })}
            </select>

            {categoryError && (
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
            {isPending ? (
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
