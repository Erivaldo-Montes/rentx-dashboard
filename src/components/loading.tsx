'use client'
interface Props {
  color?: string
}
export function Loading({ color = '#000000' }: Props) {
  return (
    <div
      className={`w-6 h-6 rounded-full animate-spin border-2 border-solid border-[${color}] border-t-transparent`}
    ></div>
  )
}
