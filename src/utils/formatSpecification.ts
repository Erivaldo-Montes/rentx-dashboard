import { ISpecifications } from '@/utils/types/specification'

interface IformatSpecification {
  name: ISpecifications['name']
  description: string
}

interface IAddMeasurementUnit {
  name: ISpecifications['name']
  description: string
}

export function formatSpecification({
  name,
  description,
}: IformatSpecification) {
  switch (name) {
    case 'fuel':
      if (description === 'gasoline') {
        return 'Gasolina'
      }
      if (description === 'diesel') {
        return 'Disel'
      }
      if (description === 'electric') {
        return 'Elétrico'
      }
      break

    case 'people':
      return description.concat(' pessoas')

    case 'gearbox':
      if (description === 'automatic') {
        return 'Automático'
      }
      if (description === 'manual') {
        return 'Manual'
      }
      break
    default:
      return description
  }
}

export function addMeasurementUnits({
  description,
  name,
}: IAddMeasurementUnit): Record<string, any> {
  switch (name) {
    case 'acceleration':
      return {
        [name]: description.concat(' s'),
      }
    case 'power':
      return {
        [name]: description.concat(' HP'),
      }
    case 'speed':
      return {
        [name]: description.concat(' km/h'),
      }
    default:
      return { [name]: description }
  }
}
