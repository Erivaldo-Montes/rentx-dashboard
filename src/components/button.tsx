import { Loading } from '@/components/loading'

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSubmitting?: boolean
  buttonStyle?: 'GREEN' | 'RED'
  text: string
}

export function Button({
  isSubmitting = false,
  buttonStyle = 'GREEN',
  text,
  ...rest
}: IButtonProps) {
  return (
    <button
      type="submit"
      className={`hover:brightness-110 flex rounded-lg ${buttonStyle === 'RED' ? 'bg-red-600' : ' bg-green-600'} w-[7rem] py-2 justify-center text-white mb-10`}
      {...rest}
    >
      {isSubmitting ? (
        <Loading />
      ) : (
        <p className="text-md text-center">{text}</p>
      )}
    </button>
  )
}
