import { ListType } from '@/@types/list'

interface FetchItemProps {
  type: ListType
  page: number
}

interface GetLinkForDetailsProps {
  type: ListType
  id: string
}

const fieldOrder = {
  USERS: ['name', 'brand', 'daily_rate', 'license_plate', 'available'],
  CARS: ['id', 'name', 'e-mail', 'driver_license', 'role'],
}

function list() {
  function getLinkFetchItems({ type, page }: FetchItemProps) {
    switch (type) {
      case ListType.cars:
        return `/car/list?page=${page}`
      case ListType.users:
        return ``
    }
  }

  function getLinkForDetails({ type, id }: GetLinkForDetailsProps) {
    switch (type) {
      case ListType.cars:
        return `/dashboard/car/${id}`
      case ListType.users:
        return ''
    }
  }

  function organizeFields<T extends Record<string, any>>(
    item: T,
    type: ListType,
  ): T {
    const organizedField: Record<string, any> = {}

    fieldOrder[type].forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(item, field)) {
        organizedField[field] = item[field]
      }
    })
    ;(Object.keys(item) as (typeof fieldOrder)[typeof type]).forEach(
      (field) => {
        if (!Object.prototype.hasOwnProperty.call(organizedField, field)) {
          organizedField[field] = item[field]
        }
      },
    )

    return organizedField as T
  }

  return {
    getLinkFetchItems,
    getLinkForDetails,
    organizeFields,
  }
}

export function useList() {
  return list()
}
