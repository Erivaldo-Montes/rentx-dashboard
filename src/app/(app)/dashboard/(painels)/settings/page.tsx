'use client'

import { useAxiosAuth } from '@/lib/hooks/useAxiosAuth'

import { useState } from 'react'

export default function Settings() {
  const axiosAuth = useAxiosAuth()
  const [categories, setCategories] = useState([])
  axiosAuth
    .get('/category')
    .then((response) => setCategories(response.data.categories))
  return (
    <div className="px-[320px]">
      <main>
        <h1>Settings</h1>
        {categories.map((item) => (
          <span key={item.id}>{item.name}</span>
        ))}
      </main>
    </div>
  )
}
