import Link from 'next/link'

export default function Home() {
  return (
    <>
      <div>
        <Link href={'/cars'}>
          <h1>cars</h1>
        </Link>
      </div>
    </>
  )
}
