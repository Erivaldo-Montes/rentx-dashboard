import { Header } from '@/components/header'
import { Plus, MagnifyingGlass } from '@phosphor-icons/react/dist/ssr'

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
        <p className="text-sm mt-[5rem]">Lista de carros</p>
        <table className="w-full table-fixed">
          <thead className="w-full">
            <tr className=" bg-gray-300 flex rounded-t-lg w-full justify-between ">
              <th className="p-2 w-40 ">Nome</th>
              <th className="p-2  w-40">Marca</th>
              <th className="p-2 w-40"> Diária</th>
              <th className="p-2 w-40">Placa</th>
              <th className="rounded-tr-lg p-2 w-40">Disponível</th>
            </tr>
          </thead>
          <tbody className="overflow-auto block   h-[30rem]">
            <tr className="border-b-[1px] w-full flex  p-2 justify-between  bg-white">
              <td className="text-center p-2 w-40">Onix</td>
              <td className="text-center p-2 w-40">Chevrolet d</td>
              <td className="text-center p-2 w-40">R$ 120.00</td>
              <td className="text-center p-2 w-40">FGD-3561</td>
              <td className="text-center p-2 w-40">sim</td>
            </tr>
            <tr className="border-b-[1px] w-full flex  p-2 justify-between  bg-white">
              <td className="text-center p-2 w-40">Onix</td>
              <td className="text-center p-2 w-40">Chevrolet d</td>
              <td className="text-center p-2 w-40">R$ 120.00</td>
              <td className="text-center p-2 w-40">FGD-3561</td>
              <td className="text-center p-2 w-40">sim</td>
            </tr>
            <tr className="border-b-[1px] w-full flex  p-2 justify-between  bg-white">
              <td className="text-center p-2 w-40">Onix</td>
              <td className="text-center p-2 w-40">Chevrolet d</td>
              <td className="text-center p-2 w-40">R$ 120.00</td>
              <td className="text-center p-2 w-40">FGD-3561</td>
              <td className="text-center p-2 w-40">sim</td>
            </tr>
            <tr className="border-b-[1px] w-full flex  p-2 justify-between  bg-white">
              <td className="text-center p-2 w-40">Onix</td>
              <td className="text-center p-2 w-40">Chevrolet d</td>
              <td className="text-center p-2 w-40">R$ 120.00</td>
              <td className="text-center p-2 w-40">FGD-3561</td>
              <td className="text-center p-2 w-40">sim</td>
            </tr>
            <tr className="border-b-[1px] w-full flex  p-2 justify-between  bg-white">
              <td className="text-center p-2 w-40">Onix</td>
              <td className="text-center p-2 w-40">Chevrolet d</td>
              <td className="text-center p-2 w-40">R$ 120.00</td>
              <td className="text-center p-2 w-40">FGD-3561</td>
              <td className="text-center p-2 w-40">sim</td>
            </tr>
            <tr className="border-b-[1px] w-full flex  p-2 justify-between  bg-white">
              <td className="text-center p-2 w-40">Onix</td>
              <td className="text-center p-2 w-40">Chevrolet d</td>
              <td className="text-center p-2 w-40">R$ 120.00</td>
              <td className="text-center p-2 w-40">FGD-3561</td>
              <td className="text-center p-2 w-40">sim</td>
            </tr>
            <tr className="border-b-[1px] w-full flex  p-2 justify-between  bg-white">
              <td className="text-center p-2 w-40">Onix</td>
              <td className="text-center p-2 w-40">Chevrolet d</td>
              <td className="text-center p-2 w-40">R$ 120.00</td>
              <td className="text-center p-2 w-40">FGD-3561</td>
              <td className="text-center p-2 w-40">sim</td>
            </tr>
            <tr className="border-b-[1px] w-full flex  p-2 justify-between  bg-white">
              <td className="text-center p-2 w-40">Onix</td>
              <td className="text-center p-2 w-40">Chevrolet d</td>
              <td className="text-center p-2 w-40">R$ 120.00</td>
              <td className="text-center p-2 w-40">FGD-3561</td>
              <td className="text-center p-2 w-40">sim</td>
            </tr>
            <tr className="border-b-[1px] w-full flex  p-2 justify-between  bg-white">
              <td className="text-center p-2 w-40">Onix</td>
              <td className="text-center p-2 w-40">Chevrolet d</td>
              <td className="text-center p-2 w-40">R$ 120.00</td>
              <td className="text-center p-2 w-40">FGD-3561</td>
              <td className="text-center p-2 w-40">sim</td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  )
}
