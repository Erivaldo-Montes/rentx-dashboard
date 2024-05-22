import { ISpecifications } from '@/@types/specification'

interface IformatSpecification {
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
      if (description === 'eletric') {
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
