import React from 'react'
import NextImage from 'next/image'
interface SpecificationCardProps extends React.HTMLProps<HTMLDivElement> {
  imageUrl: string
  field: string
}

export function SpecificationCard({
  imageUrl,
  field,
  ...rest
}: SpecificationCardProps) {
  return (
    <div
      className="bg-gray-200 p-5 flex justify-center items-center flex-col"
      {...rest}
    >
      <NextImage width={100} height={100} src={imageUrl} alt="icon" />
      <span>{field}</span>
    </div>
  )
}
