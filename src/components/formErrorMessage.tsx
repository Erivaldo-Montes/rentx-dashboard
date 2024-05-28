interface IFormErrorMessage {
  isShow: boolean
  message: string | undefined
}

export function FormErrorMessage({ isShow, message }: IFormErrorMessage) {
  if (!isShow) {
    return null
  }
  return <div className="text-red-600 text-sm">{message}</div>
}
