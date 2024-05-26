'use client'

import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, FreeMode, Thumbs } from 'swiper/modules'
import { useDropzone } from 'react-dropzone'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'
import { useState } from 'react'
import { Plus, Trash } from '@phosphor-icons/react'
import { api } from '@/lib/axios'
import { AppError } from '@/utils/appError'
import { toast } from 'react-toastify'
import { ConfirmationDialog } from '@/components/confirmationDialog'
import { PhotoSvg } from '@/components/icons/photo'

interface CarImages {
  imageFilenames: string[]
  carId: string
}

export function CarImages({ imageFilenames, carId }: CarImages) {
  const [removeImageDialogIsOpen, setRemoveImageDialogIsOpen] = useState(false)
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [imageToRemove, setImageToRemove] = useState<string>(imageFilenames[0])

  const { getRootProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    onDrop: async (acceptedFiles) => {
      const files = acceptedFiles.map((file) => {
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })

        return file
      })
      try {
        await api.post(`/car/images/${carId}`, files, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        console.log(files)

        toast.success('Imagem enviada com sucesso')
        window.location.reload()
      } catch (error) {
        const isAppError = error instanceof AppError
        const title = isAppError ? error.message : 'Não foi possivel criar'
        toast.error(title)
      }
    },
  })

  async function handleRemoveImage() {
    try {
      console.log(imageToRemove)
      await api.post(`/car/image/${imageToRemove}`, {
        car_id: carId,
      })

      toast.success('Imagem removida')
      window.location.reload()
    } catch (error) {
      console.error(error)
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível remover imagem'
      toast.error(title)
    }
  }

  return (
    <div className="max-w-[600px] max-lg:w-full">
      <ConfirmationDialog
        isOpen={removeImageDialogIsOpen}
        onClose={() => {
          setRemoveImageDialogIsOpen(false)
        }}
        title="Deseja remover a image?"
        actionFunction={handleRemoveImage}
      />
      {imageFilenames.length === 0 ? (
        <div className="flex justify-center items-center">
          <PhotoSvg width={300} height={300} />
        </div>
      ) : (
        <Swiper
          modules={[Navigation, FreeMode, Thumbs]}
          slidesPerView={1}
          navigation={true}
          onSlideChange={(e) => {
            console.log(e.activeIndex)
            setImageToRemove(imageFilenames[e.activeIndex])
          }}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          className="h-[300px] w-full"
        >
          {imageFilenames.map((item, index) => {
            return (
              <SwiperSlide key={index}>
                <div className="h-full w-full relative">
                  <Image
                    src={`http://0.0.0.0:3333/car/image/${item}`}
                    fill
                    alt="car image"
                    className="block object-contain"
                  />
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      )}

      <span className="w-full flex justify-center px-5 mt-2 gap-2">
        {imageFilenames.length !== 0 && (
          <div
            className="h-10 w-10 bg-red-600 flex justify-center items-center rounded-lg cursor-pointer"
            title="Remover imagem"
            onClick={() => setRemoveImageDialogIsOpen(true)}
          >
            <Trash size={20} className="" color="#ffffff" />
          </div>
        )}

        <div
          className="h-10 w-10 bg-blue-400 flex justify-center items-center rounded-lg"
          title="adicionar imagem"
          {...getRootProps()}
        >
          <Plus size={20} color="#ffffff" />
        </div>
      </span>
      <div>
        <Swiper
          onSwiper={setThumbsSwiper}
          slidesPerView={6}
          spaceBetween={12}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="thumbs mt-3 h-32 w-full rounded-lg "
        >
          {imageFilenames.map((item, index) => {
            return (
              <SwiperSlide key={index}>
                <div className="flex h-full w-full items-center justify-center cursor-pointer">
                  <Image
                    src={`http://0.0.0.0:3333/car/image/${item}`}
                    height={100}
                    width={100}
                    alt="car image"
                    className="block object-cover"
                  />
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </div>
  )
}
