import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface BotProps {
    src: string
}

const BotAvatar = ({
    src
}: BotProps) => {
  return (
    <Avatar className="h-12 w-12">
    <AvatarImage src={src} />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
  )
}

export default BotAvatar
