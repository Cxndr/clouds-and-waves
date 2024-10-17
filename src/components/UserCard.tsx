import { Profile } from '@/utils/types/profile.type';
import * as HoverCard from "@radix-ui/react-hover-card";
import Image from 'next/image';


export default function UserCard({user}:{user: Profile}) {

  return (
    <HoverCard.Root openDelay={100} closeDelay={100}>

      <HoverCard.HoverCardTrigger asChild>
        <a href={`/profile/${user.clerkId}`}>
          <Image 
            src={user.clerkUser.imageUrl} 
            alt={`${user.clerkUser.username}`}
            width="100" height="100"
          />
        </a>
      </HoverCard.HoverCardTrigger>

      <HoverCard.HoverCardContent sideOffset={5}>
        <div>
          <h3>{user.clerkUser.username}</h3>
          <p>{user.bio}</p>
        </div>
      </HoverCard.HoverCardContent>

    </HoverCard.Root>
  )
}