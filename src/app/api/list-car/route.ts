import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page')

  const res = await fetch(`${process.env.BASE_URL}/car/list?page=${page}`, {})
  if (res.status !== 200) {
    return Response.error()
  }

  const cars = await res.json()

  return Response.json(cars)
}