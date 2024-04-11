interface FieldCarInformationProps {
  field: string
  value: any
}

export function FieldCarInformation({
  field,
  value,
}: FieldCarInformationProps) {
  return (
    <p className="text-xl mt-5">
      <span className="text-gray-500 text-base">{field}</span> {value}
    </p>
  )
}
