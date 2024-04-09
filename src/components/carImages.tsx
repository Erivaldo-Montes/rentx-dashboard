import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, FreeMode, Thumbs } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'
import { useEffect, useState } from 'react'
import { Plus, Trash } from '@phosphor-icons/react'

const imagesCarArray = [
  'https://imgd.aeplcdn.com/370x208/n/cw/ec/130591/fronx-exterior-right-front-three-quarter-109.jpeg?isig=0&q=80',
  'https://nxboats.com.br/wp-content/uploads/2023/11/Lamborghini.jpg',
  'https://dicas.olx.com.br/wp-content/uploads/2023/06/Melhores-carros-fiat-2023-.jpg',
  'https://www.infomoney.com.br/wp-content/uploads/2022/11/main_webp_comprar-haval-h6_38eb3e1db2.jpg-e1690562379379.jpg?fit=848%2C496&quality=50&strip=all',
  'https://dicas.olx.com.br/wp-content/uploads/2023/06/Melhores-carros-fiat-2023-.jpg',
]

export function CarImages() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  useEffect(() => {
    console.log(thumbsSwiper)
  }, [thumbsSwiper])
  return (
    <div className="max-w-[600px]">
      <Swiper
        modules={[Navigation, FreeMode, Thumbs]}
        slidesPerView={1}
        navigation={true}
        loop={true}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        className="h-[400px] w-full"
      >
        {imagesCarArray.map((item, index) => {
          return (
            <SwiperSlide key={index}>
              <div className="h-full w-full relative">
                <Image
                  src={item}
                  fill
                  alt="car image"
                  className="block w-full h-full object-contain"
                />
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
      <span className="w-full flex justify-center px-5 mt-2 gap-2">
        <div
          className="h-10 w-10 bg-red-600 flex justify-center items-center rounded-lg"
          title="Remover imagem"
        >
          <Trash size={20} className="" color="#ffffff" />
        </div>
        <div
          className="h-10 w-10 bg-blue-400 flex justify-center items-center rounded-lg"
          title="adicionar imagem"
        >
          <Plus size={20} color="#ffffff" />
        </div>
      </span>
      <div>
        <Swiper
          onSwiper={setThumbsSwiper}
          slidesPerView={4}
          spaceBetween={12}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="thumbs mt-3 h-32 w-full rounded-lg "
        >
          {imagesCarArray.map((item, index) => {
            return (
              <SwiperSlide key={index}>
                <div className="flex h-full w-full items-center justify-center cursor-pointer">
                  <Image
                    src={item}
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
