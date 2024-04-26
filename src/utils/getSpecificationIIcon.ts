import gasolinePng from '@/assets/energy.png'
import capacityPeoplePng from '@/assets/capacity-people.png'
import accelerationPng from '@/assets/acceleration.png'
import gearboxPng from '@/assets/gearbox.png'
import speedPng from '@/assets/speed.png'
import strengthPng from '@/assets/strenght.png'

type Props = {
  field: string
}

type Response = {
  icon: string
  name: string
}

export function getSpecificationIcon({ field }: Props): Response {
  switch (field) {
    case 'acceleration':
      return {
        icon: accelerationPng.src,
        name: 'Aceleração de 0 a 100',
      }
      break
    case 'people':
      return {
        icon: capacityPeoplePng.src,
        name: 'Pessoas',
      }
    case 'gearbox':
      return {
        icon: gearboxPng.src,
        name: 'Câmbio',
      }
    case 'fuel':
      return {
        icon: gasolinePng.src,
        name: 'Combustível',
      }
    case 'power':
      return {
        icon: strengthPng.src,
        name: 'Força',
      }

    case 'speed':
      return {
        icon: speedPng.src,
        name: 'Velocidade',
      }
    default:
      return {
        icon: gasolinePng.src,
        name: 'especificação do carro',
      }
  }
}
