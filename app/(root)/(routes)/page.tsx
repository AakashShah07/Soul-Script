import Categories from '@/components/categories';
import Companions from '@/components/companions';
import Search_input from '@/components/search_input'
import prismadb from '@/lib/prismadb'
import React from 'react'

interface pageProps{
  searchParams : {
    categoryId: string,
    name: string
  }
}

const page =  async({
  searchParams
}: pageProps) => {

  const data = await prismadb.companion.findMany({
    where:{
      categoryId: searchParams.categoryId,
      name: {
        search: searchParams.name
      }
    },
    orderBy:{
      createdAt: "desc",
    },
    include:{
      _count:{
        select:{
          messages: true
        }
      }
    }
  });

  const categories =  await prismadb.category.findMany();

  return (
    <div className='h-full p-4 space-y-2'>
      <Search_input/>
      <Categories data={categories}/>
      <Companions data={data}/>
    </div>
  )
}

export default page
