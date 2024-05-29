import { useEffect, useState } from 'react'
import { api } from '@/lib/axios'

type Category = {
  id: string
  name: string
  description: string
  create_at: string
}

interface CategorySelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  errorMessage: string | undefined
}
export function SelectCategoryInput({
  errorMessage,
  ...rest
}: CategorySelectProps) {
  const [categories, setCategories] = useState<Category[]>([])
  async function getCategories() {
    try {
      const response = await api.get(`/category`)

      const data = response.data

      setCategories(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getCategories()
  }, [])
  return (
    <select
      {...rest}
      className={`bg-white w-full p-2 rounded-lg outline-gray-300 ${errorMessage && 'border-red-600 border-2 outline-red-600'}`}
    >
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
