import { NextRequest } from 'next/server'
import { api } from '@/lib/axios'
export async function POST(request: NextRequest) {
  const body = await request.json()

  console.log('body', body)

  const response = await api.post('/car', body)

  return Response.json({ name: 'name' })
}
