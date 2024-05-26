import { api } from '@/lib/axios'
import { ListType } from '@/utils/types/list'

interface FetchItemProps {
  type: keyof typeof ListType
  page: number
}

interface GetLinkForDetailsProps {
  type: keyof typeof ListType
  id: string
}

const fetchListUrls = { cars: '/car/list?page=', users: '' }

function list() {
  async function fetchItems(
    type: keyof typeof ListType,
    page: number,
  ): Promise<any[]> {
    console.log('link', fetchListUrls[type])
    const response = await api.get(fetchListUrls[type].concat(page.toString()))

    const cars = response.data
    console.log(cars)

    return cars
  }

  function getLinkFetchItems({ type, page }: FetchItemProps) {
    switch (type) {
      case ListType.cars:
        return `/car/list?page=${page}`
      case ListType.users:
        return ``
      default:
        return ''
    }
  }

  function getLinkForDetails({ type, id }: GetLinkForDetailsProps) {
    switch (type) {
      case ListType.cars:
        return `/dashboard/car/${id}`
      case ListType.users:
        return ''

      default:
        return ''
    }
  }

  function organizeFields<T extends Record<string, any>>(
    item: T,
    fieldOrder: (keyof T)[],
  ): T {
    const organizedField: Partial<T> = {}

    fieldOrder.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(item, field)) {
        organizedField[field] = item[field]
      }
    })
    console.log(organizedField)
    ;(Object.keys(item) as (keyof T)[]).forEach((field) => {
      if (!Object.prototype.hasOwnProperty.call(organizedField, field)) {
        organizedField[field] = item[field]
        console.log(organizedField)
      }
    })

    return organizedField as T
  }

  return {
    fetchItems,
    getLinkForDetails,
    organizeFields,
    getLinkFetchItems,
  }
}

export function useList() {
  return list()
}
