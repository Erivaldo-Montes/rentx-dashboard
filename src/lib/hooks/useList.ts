import { api } from '@/lib/axios'
import { ICar } from '@/utils/types/car'
import { ListType } from '@/utils/types/list'
import { formatToCurrency } from '@/utils/formatToCurrency'

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
    const response = await api.get(fetchListUrls[type].concat(page.toString()))

    let cars = response.data

    if (type === 'cars') {
      const carsFormatted = formatDailyRateToCurrency(response.data)
      cars = carsFormatted
      console.log('cars', carsFormatted)
    }

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
    // organize fields order
    fieldOrder.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(item, field)) {
        organizedField[field] = item[field]
      }
    })
    ;(Object.keys(item) as (keyof T)[]).forEach((field) => {
      if (!Object.prototype.hasOwnProperty.call(organizedField, field)) {
        organizedField[field] = item[field]
        console.log(organizedField)
      }
    })

    return organizedField as T
  }

  function formatDailyRateToCurrency(cars: ICar[]) {
    const carFormatted = []
    for (const car of cars) {
      const dailyRateCurrency = formatToCurrency(car.daily_rate / 100)
      carFormatted.push({ ...car, daily_rate: dailyRateCurrency })
    }

    return carFormatted
  }

  return {
    fetchItems,
    getLinkForDetails,
    getLinkFetchItems,
  }
}

export function useList() {
  return list()
}
