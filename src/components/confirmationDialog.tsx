import { useEffect, useState } from 'react'
import { X } from '@phosphor-icons/react'
import { Button } from '@/components/button'

interface IConfirmationDialogProps {
  title: string
  isOpen: boolean
  onClose: () => void
  actionFunction?: () => void
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  title,
  actionFunction,
}: IConfirmationDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
  }, [onClose])
  if (!isOpen) {
    return null
  }
  return (
    <>
      <div
        className="fixed top-0 right-0 left-0 bottom-0 bg-black/40 flex justify-center items-center z-30 transition-opacity duration-100"
        onClick={onClose}
      >
        <div
          className="bg-gray-100 p-4  relative transition-transform duration-100 transform-gpu rounded-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full flex justify-end items-end">
            <button
              className="bg-red-600 rounded-full p-1 cursor-pointer"
              onClick={onClose}
            >
              <X size={15} fill="#ffffff" />
            </button>
          </div>
          <div className="mt-5 ">{title}</div>
          <div className="flex flex-row gap-2 mt-5 flex justify-center items-center">
            <Button
              text="Sim"
              buttonStyle="GREEN"
              onClick={() => {
                if (actionFunction) {
                  actionFunction()
                }
                setIsLoading(true)
                setTimeout(() => {
                  setIsLoading(false)
                }, 500)
              }}
              isSubmitting={isLoading}
            />
            <Button text="Cancelar" buttonStyle="RED" onClick={onClose} />
          </div>
        </div>
      </div>
    </>
  )
}
