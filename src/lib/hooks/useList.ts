import { FetchType } from '@/@types/list'

interface FetchItemProps {
  type: FetchType
  page: number
}

interface GetLinkForDetailsProps {
  type: FetchType
  id: string
}

function list() {
  function getLinkFetchItems({ type, page }: FetchItemProps) {
    switch (type) {
      case FetchType.cars:
        return `/car/list?page=${page}`
      case FetchType.users:
        return ``
    }
  }

  function getLinkForDetails({ type, id }: GetLinkForDetailsProps) {
    switch (type) {
      case FetchType.cars:
        return `/dashboard/car/${id}`
      case FetchType.users:
        return ''
    }
  }

  return {
    getLinkFetchItems,
    getLinkForDetails,
  }
}

export function useList() {
  return list()
}
