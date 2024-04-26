'use client'

import React, { useEffect, useState } from 'react'
import NextImage from 'next/image'
import { getSpecificationIcon } from '@/utils/getSpecificationIIcon'

interface SpecificationCardProps extends React.HTMLProps<HTMLDivElement> {
  field: string
  value: string
}

type Icon = {
  src: string
  alt: string
}

export function SpecificationCard({
  field,
  value,
  ...rest
}: SpecificationCardProps) {
  const [icon, setIcon] = useState<Icon>({} as Icon)
  useEffect(() => {
    const icons = getSpecificationIcon({ field })
    setIcon(() => {
      return {
        src: icons.icon,
        alt: icons.name,
      }
    })
  }, [field])
  return (
    <div
      className="bg-gray-200 p-5 flex justify-center items-center flex-col w-[10.25rem] h-[10.25rem]"
      {...rest}
    >
      <NextImage width={100} height={100} src={icon?.src} alt={icon?.alt} />
      <span className="mt-4">{value}</span>
    </div>
  )
}
