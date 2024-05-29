import { ChangeEvent, useState } from 'react'

interface DailyRateProps extends React.InputHTMLAttributes<HTMLInputElement> {
  change: (e: ChangeEvent) => void
  errorMessage: string | undefined
}

export function DailyRateInput({
  change,
  errorMessage,
  defaultValue,
  ...rest
}: DailyRateProps) {
  const [daily, setDaily] = useState<string>()
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target
    const formatedValue = formatToCurrency(value)
    setDaily(formatedValue)
  }

  console.log('value', defaultValue)
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
    <input
      className={`rounded-lg p-2 outline-gray-300 ${errorMessage && 'border-red-600 border-2 outline-red-600'}`}
      value={daily || formatToCurrency(String(defaultValue))}
      onChange={(e) => {
        change(e)
        handleChange(e)
      }}
      {...rest}
    />
  )
}
