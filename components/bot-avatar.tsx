import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface BotProps {
    src: string
}

const BotAvatar = ({
    src
}) => {
  return (
    <Avatar className="h-10 w-10">
    <AvatarImage src={src} />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
  )
}

export default BotAvatar
