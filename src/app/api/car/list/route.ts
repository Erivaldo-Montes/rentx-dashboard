import { NextRequest } from 'next/server'
import { api } from '@/lib/axios'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page')

  const res = await api.get(`/car/list?page=${page}`)

  if (res.status !== 200) {
    return Response.error()
  }

  const cars = await res.data

  return Response.json(cars)
}
