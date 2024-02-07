import { Header } from '@/components/header'
import { Plus, MagnifyingGlass } from '@phosphor-icons/react/dist/ssr'
import { CarList } from '@/components/carsList'

export default function Cars() {
  return (
    <div>
      <Header />
      <main className="sm:pl-[10rem] sm:pr-[5rem] max-sm:pr-[3rem] max-sm:pl-[6rem] lg:px-[10rem] xl:px-[20rem] mt-10">
        <div className="flex justify-between ">
          <button className="p-3 flex flex-row bg-blue-600 rounded-lg sm:w-[5rem]  gap-1 hover:bg-blue-500 transition-colors">
            <Plus color="#FFFFFF" width={20} height={20} />
            <p className="text-white text-sm">Criar</p>
          </button>
          <div className="bg-white rounded-full flex flex-row justify-center items-center px-4">
            <input
              placeholder="Perquisar"
              className="border-none outline-none ml-1"
            />
            <MagnifyingGlass
              color="#6b7280"
              width={20}
              height={20}
              className="hover:cursor-pointer"
            />
          </div>
        </div>
        <p className="text-sm mt-[2rem]">Lista de carros</p>
        <CarList />
      </main>
    </div>
  )
}
