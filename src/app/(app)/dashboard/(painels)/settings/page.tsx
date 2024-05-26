'use client'

import { api } from '@/lib/axios'

import { useState } from 'react'

export default function Settings() {
  const [categories, setCategories] = useState([])
  api
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
