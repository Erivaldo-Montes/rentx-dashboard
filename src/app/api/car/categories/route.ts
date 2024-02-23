import { api } from '@/lib/axios'

export async function GET() {
  const res = await api.get('/category')

  const categories = res.data

  return Response.json(categories)
}
