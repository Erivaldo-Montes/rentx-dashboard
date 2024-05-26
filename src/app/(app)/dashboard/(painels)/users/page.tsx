import { Header } from '@/components/header'
import { List } from '@/components/list'
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr'
export default function Users() {
  return (
    <div>
      <Header />
      <main className="sm:pl-[10rem] sm:pr-[5rem] max-sm:pr-[3rem] max-sm:pl-[6rem] lg:px-[10rem] xl:px-[20rem] mt-10">
        <div className="flex justify-end ">
          <div className="bg-white rounded-full flex flex-row p-2 justify-center items-center px-4">
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
        <p className="text-sm mt-[2rem]">Lista de usuários</p>
        <List
          columns={['id', 'nome', 'E-mail', 'CNH', 'acesso']}
          type={'USERS'}
        />
      </main>
    </div>
  )
}
