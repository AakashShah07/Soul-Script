"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@clerk/nextjs";



const UserAvatar = () => {

  const {user } = useUser();

  return (
    <Avatar className="h-10 w-10">
    <AvatarImage src={user?.imageUrl} />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
  )
}

export default UserAvatar
