import Categories from '@/components/categories';
import Search_input from '@/components/search_input'
import prismadb from '@/lib/prismadb'
import React from 'react'

const page =  async() => {

  const categories = await prismadb.category.findMany();

  return (
    <div className='h-full p-4 space-y-2'>
      <Search_input/>
      <Categories data={categories}/>
    </div>
  )
}

export default page
