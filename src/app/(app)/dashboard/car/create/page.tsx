'use client'

import { useRouter } from 'next/navigation'
import { PhotoSvg } from '@/components/icons/photo'
import { ArrowLeft, Plus, Trash } from '@phosphor-icons/react/dist/ssr'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/input'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { v4 as uuidV4 } from 'uuid'
import { AppError } from '@/utils/appError'
import { toast } from 'react-toastify'
import { api } from '@/lib/axios'
import { DailyRateInput } from '@/components/dailyRateInput'
import { SelectCategoryInput } from '@/components/selectCategory'
import { Button } from '@/components/button'
import { specificationSelectOptions } from '@/utils/constants/selectOptions'
import { addMeasurementUnits } from '@/utils/formatSpecification'
import { FormErrorMessage } from '@/components/formErrorMessage'
import { formatNumberToUS } from '@/utils/formatNumberToUS'

const carSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  brand: z.string().min(1, 'Marca é obrigatório'),
  daily_rate: z.string().min(1, 'Diária é obrigatória'),
  license_plate: z.string().min(1, 'Placa é obrigatório'),
  about: z.string(),
  speed: z.coerce.number().gt(1, 'Velecidade é obrigatório'),
  people: z.string().min(1, 'Números de pessoas é obrigatório'),
  gearbox: z.string().min(1, 'Selecione o câmbio'),
  acceleration: z.coerce.number().min(1, 'Aceleração é obrigatório'),
  power: z.string().min(1, 'Força é obrigatório'),
  fuel: z.string().min(1, 'selecione o combustível'),
  category: z.string().min(1, 'Obrigatório'),
})

type CreateCarDataSchema = z.infer<typeof carSchema>

type SpecificationsSchema = Pick<
  CreateCarDataSchema,
  'people' | 'gearbox' | 'acceleration' | 'power' | 'fuel' | 'speed'
>

export default function CreateCar() {
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
      acceleration: 0,
      people: '',
      power: '',
      speed: 0,
    },
  })

  async function handleCreateCar(data: CreateCarDataSchema) {
    // convert daily rate in number
    const value = data.daily_rate.match(/\d+/g)

    if (value) {
      const valueString = value.join('')

      data.daily_rate = valueString
      console.log('data daiky', data.daily_rate)
      try {
        const responseCar = await api.post('/car', {
          name: data.name,
          brand: data.brand,
          about: data.about,
          daily_rate: Number(data.daily_rate),
          license_plate: data.license_plate,
          category_id: data.category,
        })

        const specifications: (keyof SpecificationsSchema)[] = [
          'acceleration',
          'fuel',
          'gearbox',
          'people',
          'power',
          'speed',
        ]

        const formattedSpecification: Record<string, any>[] =
          specifications.map((item) => {
            return addMeasurementUnits({
              name: item,
              description: String(data[item]),
            })
          })

        specifications.forEach((specification) => {
          api
            .post(`/car/specification/${responseCar.data.id}`, {
              name: specification,
              description: formattedSpecification.find(
                (item) => item[specification],
              )?.[specification],
            })
            .then()
        })

        await api.post(`/car/images/${responseCar.data.id}`, files, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        toast.success('Carro criado com sucesso')
        router.replace('/dashboard/cars')
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

            <FormErrorMessage
              isShow={!!errors.name}
              message={errors.name?.message}
            />
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

            <FormErrorMessage
              isShow={!!errors.brand}
              message={errors.brand?.message}
            />
          </div>

          <div className="flex flex-col gap-2 col-span-1 ">
            <p className="text-sm">Categoria</p>

            <Controller
              control={control}
              name="category"
              render={({ field: { onBlur, onChange } }) => (
                <SelectCategoryInput
                  errorMessage={errors.category?.message}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />

            <FormErrorMessage
              isShow={!!errors.category}
              message={errors.category?.message}
            />
          </div>

          <div className="flex flex-col gap-2 col-span-1 ">
            <label htmlFor="daily_rate" className="text-sm">
              Diária
            </label>

            <Controller
              control={control}
              name="daily_rate"
              render={({ field: { onChange, onBlur } }) => (
                <DailyRateInput
                  change={onChange}
                  onBlur={onBlur}
                  errorMessage={errors.daily_rate?.message}
                />
              )}
            />

            <FormErrorMessage
              isShow={!!errors.daily_rate}
              message={errors.daily_rate?.message}
            />
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

            <FormErrorMessage
              isShow={!!errors.license_plate}
              message={errors.license_plate?.message}
            />
          </div>

          <div className="flex flex-col gap-2 col-span-2 ">
            <label htmlFor="gearbox">Câmbio</label>

            <select
              {...register('gearbox')}
              className={`bg-white w-full p-2 rounded-lg outline-gray-300 ${errors.gearbox && 'border-red-600 border-2 outline-red-600'}`}
            >
              <option value="selecione">selecione</option>
              {specificationSelectOptions.gearbox.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.text}
                </option>
              ))}
            </select>
            <FormErrorMessage
              isShow={!!errors.gearbox}
              message={errors.gearbox?.message}
            />
          </div>

          <div className="flex flex-col gap-2 col-span-1 ">
            <label htmlFor="speed">Velocidade Max. (km/h)</label>

            <Controller
              control={control}
              name="speed"
              render={({ field: { onChange, onBlur } }) => (
                <Input
                  errorMessage={errors.speed}
                  type="number"
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />

            <FormErrorMessage
              isShow={!!errors.speed}
              message={errors.speed?.message}
            />
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

            <FormErrorMessage
              isShow={!!errors.people}
              message={errors.people?.message}
            />
          </div>

          <div className="flex flex-col gap-2 col-span-2 ">
            <label htmlFor="acceleration">
              Tempo de aceleração (0 a 100) em segundos
            </label>
            <Controller
              control={control}
              name="acceleration"
              render={({ field: { onChange, onBlur } }) => (
                <Input
                  type="number"
                  errorMessage={errors.acceleration}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />

            <FormErrorMessage
              isShow={!!errors.acceleration}
              message={errors.acceleration?.message}
            />
          </div>

          <div className="flex flex-col gap-2 col-span-1 ">
            <label htmlFor="fuel">Combustível</label>
            <select
              {...register('fuel')}
              className={`bg-white w-full p-2 rounded-lg outline-gray-300 ${errors.gearbox && 'border-red-600 border-2 outline-red-600'}`}
            >
              <option value={''}>selecione</option>
              {specificationSelectOptions.fuel.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.text}
                </option>
              ))}
            </select>

            <FormErrorMessage
              isShow={!!errors.fuel}
              message={errors.fuel?.message}
            />
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

            <FormErrorMessage
              isShow={!!errors.power}
              message={errors.power?.message}
            />
          </div>

          <div className="flex flex-col gap-2 col-span-4">
            <label htmlFor="about" className="text-sm">
              sobre
            </label>
            <textarea
              className="rounded-lg p-2 h-[6.25rem] outline-gray-300 resize-none"
              {...register('about')}
            />
            <FormErrorMessage
              isShow={!!errors.about}
              message={errors.about?.message}
            />
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
          <Button
            isSubmitting={isSubmitting}
            onClick={handleSubmit(handleCreateCar)}
            text="Criar"
          />
        </div>
      </div>
    </div>
  )
}
