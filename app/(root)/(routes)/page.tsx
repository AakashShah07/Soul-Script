import { UserButton } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <div>
      <UserButton afterSwitchSessionUrl='/'/>
    </div>
  )
}

export default page
