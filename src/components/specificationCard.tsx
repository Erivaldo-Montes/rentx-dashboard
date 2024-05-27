'use client'

import React, { useEffect, useState } from 'react'
import NextImage from 'next/image'
import { getSpecificationIcon } from '@/utils/getSpecificationIIcon'
import { UpdateSpecification } from '@/components/updateSpecification'
import { ISpecifications } from '@/utils/types/specification'
import { formatSpecification } from '@/utils/formatSpecification'

interface SpecificationCardProps extends React.HTMLProps<HTMLDivElement> {
  specification: ISpecifications
}

type Icon = {
  src: string
  alt: string
}

export function SpecificationCard({
  specification,
  ...rest
}: SpecificationCardProps) {
  const [icon, setIcon] = useState<Icon>({} as Icon)
  const [isUpdateSpecificationModalOpen, setIsUpdateSpecificationModalOpen] =
    useState(false)

  useEffect(() => {
    const icons = getSpecificationIcon({ field: specification.name })
    setIcon(() => {
      return {
        src: icons.icon,
        alt: icons.name,
      }
    })
  }, [])
  return (
    <div
      onClick={() => {
        setIsUpdateSpecificationModalOpen(true)
      }}
      className="bg-gray-200 p-5 flex justify-center items-center flex-col w-[10.25rem]  h-[10.25rem] cursor-pointer"
      {...rest}
    >
      <UpdateSpecification
        onClose={() => setIsUpdateSpecificationModalOpen(false)}
        isOpen={isUpdateSpecificationModalOpen}
        specification={specification}
      />

      <NextImage
        width={100}
        height={100}
        src={icon.src}
        alt="specifications"
        title={icon.alt}
      />
      <span className="mt-4">
        {formatSpecification({
          name: specification.name,
          description: specification.description,
        })}
      </span>
    </div>
  )
}
