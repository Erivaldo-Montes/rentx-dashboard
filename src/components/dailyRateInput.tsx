import { Input } from '@/components/input'
import { ChangeEvent, useState } from 'react'

interface DailyRateProps extends React.InputHTMLAttributes<HTMLInputElement> {
  change: (e: ChangeEvent) => void
  errorMessage: string | undefined
}

export function DailyRateInput({
  change,
  errorMessage,

  ...rest
}: DailyRateProps) {
  const [daily, setDaily] = useState<string>('')
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target
    const formatedValue = formatToCurrency(value)
    setDaily(formatedValue)
  }
  function formatToCurrency(input: string) {
    // Remove qualquer caractere que não seja um dígito numérico
    let formatedValue = input.replace(/\D/g, '')

    // Formata o número para o formato monetário (com duas casas decimais e separador de milhares)
    formatedValue = (Number(formatedValue) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })

    return formatedValue
  }

  return (
    <Input
      errorMessage={errorMessage}
      value={daily}
      {...rest}
      onChange={(e) => {
        change(e)
        handleChange(e)
      }}
    />
  )
}
